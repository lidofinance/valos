---
id: sec-mit-code-testing
title: Comprehensive Testing for Changes to Code
risks:
  - FIN3
  - FIN4
  - SLS1
  - SLS2
  - SLS3
  - SLS4
  - SLS5
  - SLS6
  - SLS7
  - SLS14
  - SLS15
  - SLS17
  - SLS18
  - SLS19
  - KEC7
  - HCK1
  - HCK2
  - HCK3
  - HCK4
  - HCK5
  - HCK6
  - GIR6
  - GIR7
  - GIR9
  - GIR10
  - GIR11
  - GIR13
  - GIR15
  - GIR17
  - GIR18
  - GIR21
  - GIR23
  - GIR24
  - SPS1
---
A comprehensive test suite helps ensure changes do not introduce new vulnerabilities or situations that lead to operational failures.
Equally, it is important that someone other than the developer who produces Code changes reviews them.

Static and Dynamic analysis is important, as well as user testing wherever changes impact user interface or user-generated content.

Measuring test coverage, and requiring new tests that are reviewed as part of and code review,
help ensure that coverage is sufficiently comprehensive to detect errors that can arise through later changes.

##### Best practices for testing code changes include {#bp-testing-code-changes}

- incorporating static and dynamic testing in the integration pipeline for code development.

<div class="info">

##### Risks that testing and code review can mitigate

* [FIN3](#risk-fin-3), [FIN4](#risk-fin-4)
* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS5](#risk-sls-5), [SLS6](#risk-sls-6), [SLS7](#risk-sls-7), [SLS14](#risk-sls-14), [SLS15](#risk-sls-15), [SLS17](#risk-sls-17), [SLS18](#risk-sls-18), [SLS19](#risk-sls-19)
* [DOW2](#risk-dow-2), [DOW6](#risk-dow-6), [DOW10](#risk-dow-10), [DOW11](#risk-dow-11), [DOW12](#risk-dow-12), [DOW13](#risk-dow-13), [DOW14](#risk-dow-14),  [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [KEC7](#risk-kec-7)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4), [HCK5](#risk-hck-5), [HCK6](#risk-hck-6)
* [GIR6](#risk-gir-6), [GIR7](#risk-gir-7), [GIR9](#risk-gir-9), [GIR10](#risk-gir-10), [GIR11](#risk-gir-11), [GIR13](#risk-gir-13), [GIR15](#risk-gir-15), [GIR17](#risk-gir-17), [GIR18](#risk-gir-18), [GIR21](#risk-gir-21), [GIR23](#risk-gir-23), [GIR24](#risk-gir-24)
* [SPS1](#risk-sps-1)
</div>
