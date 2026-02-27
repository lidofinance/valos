#!/bin/bash
# Validates risk references in valos-spec.html
# Checks:
# 1. Risk labels match their anchor links
# 2. No unintentional duplicate risks in the same list
# 3. All referenced risk IDs exist in the risk table

set -e

SPEC_FILE="valos-spec.html"
ERRORS=0

echo "Validating risk references in $SPEC_FILE..."
echo

# Check 1: Labels must match their anchor links
echo "=== Checking label/link mismatches ==="
mismatch_count=0
while IFS= read -r line; do
  line_num=$(echo "$line" | cut -d: -f1)
  content=$(echo "$line" | cut -d: -f2-)
  # Extract all risk references from this line
  echo "$content" | grep -oE '\[[A-Z]+[0-9]*\]\(#risk-[a-z]+-[0-9]+\)' | while read -r match; do
    label=$(echo "$match" | sed -E 's/\[([A-Z]+[0-9]*)\].*/\1/')
    link_prefix=$(echo "$match" | sed -E 's/.*#risk-([a-z]+)-([0-9]+).*/\1/' | tr '[:lower:]' '[:upper:]')
    link_num=$(echo "$match" | sed -E 's/.*#risk-([a-z]+)-([0-9]+).*/\2/')
    expected="${link_prefix}${link_num}"
    if [ "$label" != "$expected" ]; then
      echo "ERROR: Line $line_num: Label mismatch $match (label: $label, expected: $expected)"
    fi
  done
done < <(grep -n '\[.*\](#risk-' "$SPEC_FILE") > /tmp/mismatches.txt

if [ -s /tmp/mismatches.txt ]; then
  cat /tmp/mismatches.txt
  ERRORS=$((ERRORS + $(wc -l < /tmp/mismatches.txt)))
else
  echo "OK: All labels match their links"
fi
echo

# Check 2: No duplicates within the same risk list line
echo "=== Checking for duplicate risks in same list ==="
line_num=0
while IFS= read -r line; do
  line_num=$((line_num + 1))
  # Only check lines that contain risk references (bullet points with risks)
  if echo "$line" | grep -qE '^\* \['; then
    # Extract all risk IDs from this line
    risks=$(echo "$line" | grep -oE '\[[A-Z]+[0-9]+\]' | sort)
    duplicates=$(echo "$risks" | uniq -d)
    if [ -n "$duplicates" ]; then
      echo "ERROR: Line $line_num has duplicate risks: $duplicates"
      echo "  Line: ${line:0:100}..."
      ERRORS=$((ERRORS + 1))
    fi
  fi
done < "$SPEC_FILE"

if [ $ERRORS -eq 0 ]; then
  echo "OK: No duplicate risks found in any list"
fi
echo

# Check 3: All referenced risk IDs must exist in the risk table
echo "=== Checking for non-existent risk references ==="

# Extract all risk table IDs (anchors defined with id="risk-xxx-n")
defined_risks=$(grep -oE 'id="risk-[a-z]+-[0-9]+"' "$SPEC_FILE" | sed -E 's/id="(risk-[a-z]+-[0-9]+)"/\1/' | sort -u)

# Find references to non-existent risks (with line numbers)
missing_count=0
while IFS= read -r line; do
  line_num=$(echo "$line" | cut -d: -f1)
  content=$(echo "$line" | cut -d: -f2-)
  # Extract all risk references from this line
  for ref in $(echo "$content" | grep -oE '#risk-[a-z]+-[0-9]+' | sed 's/#//'); do
    if ! echo "$defined_risks" | grep -q "^${ref}$"; then
      echo "ERROR: Line $line_num: Referenced risk '$ref' does not exist in risk table"
      missing_count=$((missing_count + 1))
    fi
  done
done < <(grep -n '#risk-' "$SPEC_FILE")

ERRORS=$((ERRORS + missing_count))

if [ $missing_count -eq 0 ]; then
  echo "OK: All referenced risks exist in the risk table"
fi
echo

# Summary
echo "=== Summary ==="
if [ $ERRORS -gt 0 ]; then
  echo "FAILED: Found $ERRORS error(s)"
  exit 1
else
  echo "PASSED: All risk reference checks passed"
  exit 0
fi
