[[ISO 27001](#ref-iso-27001)] # ValOS

Copyright© 2025, Lido Foundation. This document may be used, modified, copied and distributed under the terms of the [Apache 2 License](./LICENSE).

## Editor's draft post version 1


<dl>
<dt>This draft date:</dt>
<dd>2025-08-09</dd>

<dt>Version 1 URL:</dt>
<dd><a href="https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base">https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base</a></dd>

<dt>Contributors to this version:</dt>

<dd>This specification builds on the content developed as the DUCK Knowledge Base, and we gratefully acknowledge the contributions from everyone who developed that. In addition, specific contributions to this version have been made by:

<br>Oriol, Miguel, Ivan Ang, Antonio Bartulovic, Albert Heinle, Sreepriya Kalarikka, Gabriella S, Isidoros P, CK Teo, Julian Ueding, Scott Waller, @dracaryspierce, Sven, Lucas

<br>(This list is a work in progress. The editor apologises for any names that have been missed, and requests that you let us know so we can rectify that).
</dd>

<dt>Editor:</dt> <dd>Chaals Nevile</dd>
</dl>


<a id="sec-abstract"></a>
## Abstract

This specification defines risks that can apply when operating a blockchain node.

It describes mitigations that can minimise the likelihood that particular risks will be realised and cause a problem,
such as compromising the ability to manage a node or actions that result in reduced economic rewards, or penalties such as slashing.

Finally, it provides a set of controls to verify that a Node Operator is appropriately managing the relevant risks.

## Table of Contents

- [Abstract](#sec-abstract)
- [Introduction](#sec-introduction)
  - [Purpose](#sec-purpose)
  - [Conformance](#sec-conformance)
- [Risks](#risks)
  - [Financial and Regulatory Risk](#sec-financial-risk)
  - [Slashing Risk](#slashing-risk)
  - [Downtime Risk](#downtime-risk)
  - [Key Management Risk](#key-custody-risk)
    - [Validator Key Custody Risk](#validator-key-custody-risk)
    - [Withdrawal Key Custody Risk](#withdrawal-key-custody-risk)
  - [General Infrastructure Risk](#general-infrastructure-risk)
  - [Service Partner Specific Risk](#service-partner-specific-risk)
  - [Reputational Risk](#reputational-risk)
- [Risk Assessment Procedures](#risk-assessment-procedures)
  - [Financial Loss](#financial-loss)
  - [Occurrence Probability](#occurrence-probability)
  - [Risk Matrix](#risk-matrix)
- [Review and Audit Procedures](#review-and-audit-procedures)
- [Mitigation Strategies](#mitigation-strategies)
  - [Risk Management](#sec-mitigations-risk=management)
  - [Technology Stack](#sec-mitigations-tech-stack)
  - [Information and Secret Management](#secret-management)
  - [Access Management](#sec-mitigations-access-management)
  - [Software Development and Update Process](#sec-mitigations-development-and-update)
  - [Monitoring](#sec-mitigations-monitoring)
  - [Incident Response](#sec-mitigations-incident-response)
  - [General Measures](#sec-mitigations-general)
- [Controls Catalog](#sec-controls-catalog)
  - [Access Control](#sec-controls-access)
  - [Monitoring](#sec-controls-monitoring)
  - [Environmental Threats](#sec-controls-environment)
  - [Update Process](#sec-controls-updates)
  - [Incident Response](#sec-controls-response)
  - [General Security Measures](#sec-controls-general)
- [Communications Strategy](#sec-communications-strategy)
- [References](#sec-references)
- [Status and Feedback](#sec-sotd)

<a id="sec-introduction"></a>
## Introduction

<a id="sec-purpose"></a>
### Purpose

This specification builds on the DUCK knowledge base as an evolution. In addition to the risk framework, updated based on feedback from practitioners,
and an explanation of mitigation strategies that has likewise been updated, it provides a single set of controls - statements of requirement that can be tested,
to ensure that as far as possible a Node Operator is following the recognised best practices to minimise risk and effectively maximise their returns.

While there are other standards such as AICPA's SOC 2® [[SOC2](#ref-soc2)] or ISO's 27001 standard [[ISO27001](#ref-iso27001)] that can be applied to Node Operators,
they often include more general requirements than this specification, reflecting a broader scope.

The relevant controls from several such standards are explicitly linked to the controls in this specification. The purpose of this is twofold:
to simplify the process of certifying conformance to this specification for Operators who have already undergone testing against those standards,
and to simplify the process of assessing against those standards Node Operators who have been certified as conforming to this specification.

<a id="sec-conformance"></a>
### Conformance

Conformance to this specification is based on meeting the requirements expressed in the [Controls Catalog](#sec-controls-catalog).

The key words "MUST", "SHOULD", and "MAY" in this document MUST be interpreted as described in [[RFC2119](#ref-rfc2119)] as modified by [[RFC8174](#ref-rfc8174)]
when they appear in all capitals, as shown here.

## Risks

This specification divides risk into seven categories for Node Operators to consider in ensuring the quality of their overall setup.

<a id="sec-financial-risk"></a>

### Financial and Regulatory Risk

<table role="table">
<thead>
<tr>
<th width="96">ID</th>
<th width="138">Risk Group</th>
<th width="232">Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
<td id="risk-fin-1">FIN1</td>
<td>Process</td>
<td>Onboarding</td>
<td>Onboarded entities are not adequately vetted to ensure financial, operational, regulatory, or reputational appropriateness, resulting in potential financial, legal, or reputational damage</td>
</tr>
<tr>
<td id="risk-fin-2">FIN2</td>
<td>Infrastructure</td>
<td>Deposit</td>
<td>Fiat and digital assets deposited are not received in the appropriate currency, address, or fiat account, leading to financial loss</td>
</tr>
<tr>
<td id="risk-fin-3">FIN3</td>
<td>Infrastructure</td>
<td>Deposit</td>
<td>Fiat and digital assets are not correctly processed and assets are misallocated to individuals, entities, or operational addresses leading to financial loss</td>
</tr>
<tr>
<td id="risk-fin-4">FIN4</td>
<td>Process</td>
<td>Withdrawal</td>
<td>Fiat and digital assets are not correctly disbursed to individuals, entities, or addresses, leading to financial and reputational loss</td>
</tr>
<tr>
<td id="risk-fin-5">FIN5</td>
<td>Infrastructure</td>
<td>Withdrawal</td>
<td>Staking withdrawal requests cannot be met efficiently, leading to delays in payment processing causing financial and reputational loss</td>
</tr>
<tr>
<td id="risk-fin-6">FIN6</td>
<td>Infrastructure</td>
<td>Compounding</td>
<td>Staking rewards are not appropriately collected, governed, restaked, compounded, or allocated to clients leading to financial loss</td>
</tr>
<tr>
<td id="risk-fin-7">FIN7</td>
<td>Process</td>
<td>Reporting</td>
<td>Financial reporting requirements are not adhered to or inconsistently applied, leading to regulatory, legal, and financial consequences</td>
</tr>
<tr>
<td id="risk-fin-8">FIN8</td>
<td>Process</td>
<td>Reporting</td>
<td>Reconciliation of deposits, rewards, fees, and distributions are incorrectly maintained causing incomplete and inaccurate financial data, leading to financial, legal, and regulatory repercussions</td>
</tr>
</tbody>
</table>

### Slashing Risk

Performing slashable actions leading to penalties.

<table>
<thead>
<tr>
<th width="96">ID</th>
<th width="138">Risk Group</th>
<th width="232">Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-sls-1">SLS1</td>
  <td>Infrastructure</td>
  <td>Operational Failure: Single validator signs two different blocks</td>
  <td>Single node signs two different blocks, e.g. failure in setting up the anti-slashing mechanism (e.g. no lokal anti-slashing database disabled or deleted) or failure in the validator migration process.</td>
</tr>
<tr>
  <td id="risk-sls-2">SLS2</td>
  <td>Infrastructure</td>
  <td>Operational Failure: Shutting down validator only temporarily</td>
  <td>Validator shuts down temporarily. System spins up a new validator with the same key</td>
</tr>
<tr>
  <td id="risk-sls-3">SLS3</td>
  <td>Infrastructure</td>
  <td>Operational Failure: Validator keys are used on 2 different validators</td>
  <td>System takes the same keys twice from the key database and deploys them on two different validators.</td>
</tr>
<tr>
  <td id="risk-sls-4">SLS4</td>
  <td>Infrastructure</td>
  <td>Operational Failure: Failure in setting up the anti-slashing mechanisms correctly</td>
  <td>Failure in setting up the anti-slashing mechanisms correctly (e.g. Web3Signer has no slashing protection enabled, no database, database only in memory and not on disk, 2 or several copies of Web3Signer, slashing databse can be deleted)</td>
</tr>
<tr>
  <td id="risk-sls-5">SLS5</td>
  <td>Infrastructure</td>
  <td>Double key usage in the CI/CD pipeline</td>
  <td>Usage of same key within different environments causing a slashing</td>
</tr>
<tr>
  <td id="risk-sls-6">SLS6</td>
  <td>Software</td>
  <td>Software Bug (e.g. Validator Client) (Intentional or accidentional) through update</td>
  <td>New versions of a validator client that may cause errors that lead to slashing<br>Supply chain attack</td>
</tr>
<tr>
  <td id="risk-sls-7">SLS7</td>
  <td>Software</td>
  <td>Software Bug (e.g. Validator Client) through software customization</td>
  <td>New versions of a validator client has errors that lead to slashing</td>
</tr>
<tr>
  <td id="risk-sls-8">SLS8</td>
  <td>People</td>
  <td>Malicious Internal Employee intentionally causes operational failure via his given user rights</td>
  <td>Anything that an internal employee has access to is at risk of being exploited to sabotage the operation resulting in a slashing incident.</td>
</tr>
<tr>
  <td id="risk-sls-9">SLS9</td>
  <td>People</td>
  <td>Malicious Internal Employee intentionally causes operational failure via privilege escalation</td>
  <td>A malicious internal employee can get additional rights via through privileges escalation.</td>
</tr>
<tr>
  <td id="risk-sls-10">SLS10</td>
  <td>People</td>
  <td>Malicious Ex-Employee intentionally causes a slashing incident</td>
  <td>A former employee whose access is not blocked or removed </td>
</tr>
<tr>
  <td id="risk-sls-11">SLS11</td>
  <td>People</td>
  <td>Malicious External Hacker intentionally causes slashing incident</td>
  <td>Malicious External Hacker gets system access through absence of or weak cyber security standards</td>
</tr>
<tr>
  <td id="risk-sls-12">SLS12</td>
  <td>People</td>
  <td>Malicious External Hacker intentionally causes slashing incident</td>
  <td>Malicious External Hacker gets external network access to the system</td>
</tr>
<tr>
  <td id="risk-sls-13">SLS13</td>
  <td>People</td>
  <td>Malicious External Hacker intentionally causes operational failure through authentication access</td>
  <td>Malicious External Hacker can get access through by-passing or brute-forcing authentication systems</td>
</tr>
<tr>
  <td id="risk-sls-14">SLS14</td>
  <td>Process</td>
  <td>Operational Failure: Incorrect implementation of the failover mechanism: Failover system comes unexpectedly online</td>
  <td>If the failover does not ensure that old system is not still alive in some way or is using a stale version of the anti-slashing database, e.g.: failover system starts accidentally although primary system is not down</td>
</tr>
<tr>
  <td id="risk-sls-15">SLS15</td>
  <td>Process</td>
  <td>Operational Failure: Incorrect implementation of the failover mechanism: Primary system comes unexpectedly back online</td>
  <td>If the failover does not ensure that old system is not still alive in some way or is using a stale version of the anti-slashing database, e.g.: failover system starts (manually / automatically) because primary system is down and primary system comes back online</td>
</tr>
<tr>
  <td id="risk-sls-16">SLS16</td>
  <td>Process</td>
  <td>Operational Failure: Slashing monitoring does not prevent system shut down</td>
  <td>Slashing events continue because no slashing monitoring system in place</td>
</tr>
<tr>
  <td id="risk-sls-17">SLS17</td>
  <td>Process</td>
  <td>Operational Failure: Slashing monitoring ignores alerts</td>
  <td>Monitoring is in place, but slashing events keep ongoing on because alerts are not monitored</td>
</tr>
<tr>
  <td id="risk-sls-18">SLS18</td>
  <td>Process</td>
  <td>Operational Failure: Slashing monitoring does not shut down the validators</td>
  <td>Slashing keeps going on because system fails to automatically shut down after alerts</td>
</tr></tbody></table>


### Downtime Risk

Connectivity issues leading to reduced rewards.

<table>
<thead>
<tr>
<th width="109">ID</th>
<th width="141">Risk Group</th>
<th>Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-dow-1">DOW1</td>
  <td>Infrastructure</td>
  <td>External: Operational Failure of Cloud Service Provider</td>
  <td>Cloud Downtime, malfunction</td>
</tr>
<tr>
  <td id="risk-dow-2">DOW2</td>
  <td>Infrastructure</td>
  <td>Operational Failure of own bare metal set-up due to malfunction software</td>
  <td>Malfunction of software (e.g. validator client or third party software) leads to downtime</td>
</tr>
<tr>
  <td id="risk-dow-3">DOW3</td>
  <td>Infrastructure</td>
  <td>Operational Failure of own bare metal set-up due to malfunction hardware</td>
  <td>Malfunction of hardware (e.g. physical network, computer system, CPU, RAM) leads to downtime</td>
</tr>
<tr>
  <td id="risk-dow-4">DOW4</td>
  <td>Infrastructure</td>
  <td>External: Operational Failure of own bare metal set-up due to people (ManMade)</td>
  <td>Employees are responsible for the downtime event (accidentally or intentionally)</td>
</tr>
<tr>
  <td id="risk-dow-5">DOW5</td>
  <td>Infrastructure</td>
  <td>External: Operational Failure of own bare metal set-up due to natural causes</td>
  <td>A natural event (e.g. earthquake, flood, hurricane,...) leads to an downtime</td>
</tr>
<tr>
  <td id="risk-dow-6">DOW6</td>
  <td>Infrastructure</td>
  <td>Failure to design for high availability</td>
  <td>Having too few beacon nodes relative to validator clients, leading to:<br>- opportunity costs<br>- slashing on some networks</td>
</tr>
<tr>
  <td id="risk-dow-7">DOW7</td>
  <td>Infrastructure</td>
  <td>External: Internet connectivity</td>
  <td>Loss of infrastructure network connection due to:<br>- Sudden cloud outage<br>- Sudden internet failure in on-premise machines<br>- Accidental firewall change locks out access.</td>
</tr>
<tr>
  <td id="risk-dow-8">DOW8</td>
  <td>Infrastructure</td>
  <td>External: Power supply</td>
  <td>Power Breakdown</td>
</tr>
<tr>
  <td id="risk-dow-9">DOW9</td>
  <td>Infrastructure</td>
  <td>External: Power supply</td>
  <td>Volatile power supply damages infrastructure</td>
</tr>
<tr>
  <td id="risk-dow-10">DOW10</td>
  <td>Infrastructure</td>
  <td>External: DDOS attack</td>
  <td>Systems unresponsive, slowed down, and compromized due to buffer/stack overflow</td>
</tr>
<tr>
  <td id="risk-dow-11">DOW11</td>
  <td>Software</td>
  <td>Software Bug in the Validator Client</td>
  <td>Downtime or accidental interpretation of dishonest behavior</td>
</tr>
<tr>
  <td id="risk-dow-12">DOW12</td>
  <td>Software</td>
  <td>Software Bug in the Validator Client (Intentional or accidental) through software update</td>
  <td>New versions of a validator client that may cause errors that lead to downtime<br>(Supply chain attack)</td>
</tr>
<tr>
  <td id="risk-dow-13">DOW13</td>
  <td>Software</td>
  <td>Software Bug in the Validator Client through software customization</td>
  <td><br>New versions of a validator client may cause errors that lead to downtime</td>
</tr>
<tr>
  <td id="risk-dow-14">DOW14</td>
  <td>Software</td>
  <td>Software Bug in third party software</td>
  <td><br>Third party software failure can lead to downtime of the whole system</td>
</tr>
<tr>
  <td id="risk-dow-15">DOW15</td>
  <td>Software</td>
  <td>Latency / Failure of relays</td>
  <td>Latency / Failure of relays </td>
</tr>
<tr>
  <td id="risk-dow-16">DOW16</td>
  <td>People</td>
  <td>Malicious Internal Employee (intentionally causes operational failure)</td>
  <td>An employee having too privileged access</td>
</tr>
<tr>
  <td id="risk-dow-17">DOW17</td>
  <td>People</td>
  <td>Malicious Ex-Employee intentionally causes a downtime incident</td>
  <td>A Ex-Employee can still have access to the system when his access is not blocked or removed</td>
</tr>
<tr>
  <td id="risk-dow-18">DOW18</td>
  <td>People</td>
  <td>Malicious External Hacker (intentionally causes operational failure)</td>
  <td>A hacker may find a way to overload the<br>system or shut parts of it down manually.</td>
</tr>
<tr>
  <td id="risk-dow-19">DOW19</td>
  <td>Software</td>
  <td>Running outdated validator software</td>
  <td>The node operator os not updating its validator software</td>
</tr>
<tr>
  <td id="risk-dow-20">DOW20</td>
  <td>Software</td>
  <td>Validator client update incompatible with IT system</td>
  <td>System downtime after validator client update caused by incompatibility</td>
</tr></tbody></table>

### Key Custody Risk

The risks associated with Key custody are divided in this specification according to the type of Key:

- [Validator Keys](#validator-key-custody-risk) enable the operator to manage their nodes. These risks, if realised, have a direct impact on operations, which is very likely to have a financial and reputational impact, and possibly leaving an operator unable to meet contractual obligations.
- [Withdrawal Keys](#withdrawal-key-custody-risk) enable the operator to manage their digital assets, and these risks have a direct financial impact.

#### Validator Key Custody Risk

<table>
<thead>
<tr>
<th width="105">ID</th>
<th width="140">Risk Group</th>
<th width="226">Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-kec-1">KEC1</td>
  <td>Infrastructure</td>
  <td>Failure to use vault system</td>
  <td>No audit trail and controlled access to secrets</td>
</tr>
<tr>
  <td id="risk-kec-2">KEC2</td>
  <td>People</td>
  <td>Stolen / Lost Signing Keys (malicious internal employee)</td>
  <td>Malicious employee deletes or steals the signing keys</td>
</tr>
<tr>
  <td id="risk-kec-3">KEC3</td>
  <td>People</td>
  <td>Stolen / Lost Signing Keys (malicious internal employee)</td>
  <td>Malicious employee gets access to the unencrypted signing keys</td>
</tr>
<tr>
  <td id="risk-kec-4">KEC4</td>
  <td>People</td>
  <td>Stolen / Lost Signing Keys (External Hacker)</td>
  <td>Malicious external hacker deletes signing keys</td>
</tr>
<tr>
  <td id="risk-kec-5">KEC5</td>
  <td>People</td>
  <td>Stolen / Lost Signing Keys (External Hacker)</td>
  <td>Stealing the signing key from the unencrypted memory of the Web3Signer, even if keys are encrypted at rest in a vault</td>
</tr>
<tr>
  <td id="risk-kec-6">KEC6</td>
  <td>Process</td>
  <td>Loss of Signing Keys (Operational Failure)</td>
  <td>Signing keys are lost in an operational process</td>
</tr>
<tr>
  <td id="risk-kec-7">KEC7</td>
  <td>Process</td>
  <td>Privilege escalation mechanisms not prevented</td>
  <td>Someone with access to one service/node can increase their privileges and do more harm on further nodes.</td>
</tr>
<tr>
  <td id="risk-kec-8">KEC8</td>
  <td>Infrastructure</td>
  <td>Failure to protect infrastructure against physical access</td>
  <td>Someone who gains physical access to a server can have access to locally exposed ports and can access the software API</td>
</tr></tbody></table>

#### Withdrawal Key Custody Risk

<table>
<thead>
<tr>
<th width="107">ID</th>
<th width="134">Risk Group</th>
<th>Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-kec-9">KEC9</td>
  <td>Process</td>
  <td>Loss of Withdrawal Keys (Operational Failure)</td>
  <td>Loss of Withdrawal Keys (Operational Failure)</td>
</tr>
<tr>
  <td id="risk-kec-10">KEC10</td>
  <td>People</td>
  <td>Stolen Withdrawal Keys (Internal Employee)</td>
  <td>Stolen Withdrawal Keys (Internal Employee)</td>
</tr>
<tr>
  <td id="risk-kec-11">KEC11</td>
  <td>People</td>
  <td>Stolen Withdrawal Keys (External Hacker)</td>
  <td>Stolen Withdrawal Keys (External Hacker)</td>
</tr></tbody></table>


### General Infrastructure Risk

Risks related to process errors and inefficiencies of the general infrastructure.

<table>
<thead>
<tr>
  <th width="98">ID</th>
  <th width="144">Risk Group</th>
  <th>Risk Vectors</th>
  <th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-gir-1">GIR1</td>
  <td>Infrastructure</td>
  <td>Not granular enough role-definitions for access control</td>
  <td>Internal employees and external hackers may gain access to too many systems if they manage to have a highly privileged role</td>
</tr>
<tr>
  <td id="risk-gir-2">GIR2</td>
  <td>Infrastructure</td>
  <td>Token lifetimes are too wide</td>
  <td>Authentication information does not expire timely and can be used later.</td>
</tr>
<tr>
  <td id="risk-gir-3">GIR3</td>
  <td>Infrastructure</td>
  <td>Fix versions on every deploy</td>
  <td>Downtime if a system needs to be just re-started if newest version is accidentally pulled</td>
</tr>
<tr>
  <td id="risk-gir-4">GIR4</td>
  <td>Process</td>
  <td>Insufficient monitoring/logging</td>
  <td>- Inability to learn from incidents<br>- Late detection of incidents<br>- insufficient automation to react to incidents</td>
</tr>
<tr>
  <td id="risk-gir-5">GIR5</td>
  <td>Process</td>
  <td>Insufficient off-boarding controls, e.g. by too many authentication mechanisms around.</td>
  <td>terminated employee can remain having access to systems and do harm</td>
</tr>
<tr>
  <td id="risk-gir-6">GIR6</td>
  <td>Process</td>
  <td>No password rotation</td>
  <td>- Leak of passwords<br>- brute force</td>
</tr>
<tr>
  <td id="risk-gir-7">GIR7</td>
  <td>Process</td>
  <td>Use of direct auth</td>
  <td>Authentication information does not expire timely and can be used later.</td>
</tr>
<tr>
  <td id="risk-gir-8">GIR8</td>
  <td>Process</td>
  <td>No Input validation</td>
  <td>Buffer overflow attacks</td>
</tr>
<tr>
  <td id="risk-gir-9">GIR9</td>
  <td>Infrastructure</td>
  <td>Failure to properly perform network segmentation</td>
  <td>Having containers or nodes accessible from any IP addresses increases the attack vector enormously</td>
</tr>
<tr>
  <td id="risk-gir-10">GIR10</td>
  <td>Infrastructure</td>
  <td>Lack of encrypted traffic between services and deployment scripts</td>
  <td>Anyone on the network can sniff out packages with secrets included, and may be able to steal passwords and tokens in this way</td>
</tr>
<tr>
  <td id="risk-gir-11">GIR11</td>
  <td>Infrastructure</td>
  <td>No separate tests and staging environments</td>
  <td>Improper change management and testing of software updates "in production"</td>
</tr>
<tr>
  <td id="risk-gir-12">GIR12</td>
  <td>Infrastructure</td>
  <td>General architectural flaws</td>
  <td>General risk category that can cause downtime, slashing, etc.<br>This includes, but is not limited to:<br>- Non-scalable deployments<br>- Use of tools not made for this purpose<br>- Lack of robustness/redundancy<br>- Bad change management<br>- Bad container isolation</td>
</tr>
<tr>
  <td id="risk-gir-13">GIR13</td>
  <td>Infrastructure</td>
  <td>High Blast radius of software bug in overall system</td>
  <td>A small error affects the whole system and all clients right away, instead of being caught early with limited effect on the whole system.</td>
</tr>
<tr>
  <td id="risk-gir-14">GIR14</td>
  <td>Infrastructure</td>
  <td>Low Infrastructure provider security</td>
  <td>Hacks through the apis of the infrastructure provider</td>
</tr>
<tr>
  <td id="risk-gir-15">GIR15</td>
  <td>Infrastructure</td>
  <td>CVE Monitoring</td>
  <td>Attack on the system suddenly possible once published</td>
</tr>
<tr>
  <td id="risk-gir-16">GIR16</td>
  <td>People</td>
  <td>Human error</td>
  <td>Anything a human can touch can go wrong</td>
</tr>
<tr>
  <td id="risk-gir-17">GIR17</td>
  <td>Process</td>
  <td>Use of non-hardened images</td>
  <td>Attack on the system using the weakest link of a given node/container</td>
</tr>
<tr>
  <td id="risk-gir-18">GIR18</td>
  <td>Process</td>
  <td>Insufficient change management mechanisms in place</td>
  <td>- Downtime on update<br>- Slow down in reaction time to incident</td>
</tr>
<tr>
  <td id="risk-gir-19">GIR19</td>
  <td>Process</td>
  <td>Lack of automation for deloyment</td>
  <td>- Downtime on update<br>- Slow down in reaction time to incident</td>
</tr>
<tr>
  <td id="risk-gir-20">GIR20</td>
  <td>Process</td>
  <td>Lack of testing (software and infrastructure)</td>
  <td>- Downtime on update<br>- Slow down in reaction time to incident</td>
</tr>
<tr>
  <td id="risk-gir-21">GIR21</td>
  <td>Process</td>
  <td>Lack of enforced code review</td>
  <td>- Downtime on update<br>- Slow down in reaction time to incident</td>
</tr>
<tr>
  <td id="risk-gir-22">GIR22</td>
  <td>Process</td>
  <td>Lack of Security training (password hygiene, phising attacks, ...)</td>
  <td>Employees spill secrets</td>
</tr>
<tr>
  <td id="risk-gir-23">GIR23</td>
  <td>Process</td>
  <td>Make-shift container orchestration procedures</td>
  <td>Failure when e.g. failover is actually needed to be performed</td>
</tr>
<tr>
  <td id="risk-gir-24">GIR24</td>
  <td>Software</td>
  <td>Third party software and vendors</td>
  <td>Suboptimal third-party software practices</td>
</tr>
<tr>
  <td id="risk-gir-25">GIR25</td>
  <td>People</td>
  <td>Centralized knowledge</td>
  <td>If the infrastructure knowledge is not shared across the team, this could lead to a heavy dependency on a single person</td>
</tr></tbody></table>

### Service Partner Specific Risk

Risk related to running specific services.

<table>
<thead>
<tr>
<th width="92">ID</th>
<th width="119">Risk Group</th>
<th width="130">Risk Vectors</th>
<th>Risk Vector Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-sps-0">SPS0</td>
  <td>Counterparty</td>
  <td>General Counterparty Risk</td>
  <td>Whenever a service is provided by a third party, the relevant risks are run by the third party,
  but in most case at least some and often the bulk of the consequences for a failure will be borne by the node operator.</td>
</tr>
<tr>
  <td id="risk-sps-1">SPS1</td>
  <td>Process</td>
  <td>Exit Risk - Delinquent state</td>
  <td><ul><li>No new stake will be allocated to the Node Operator (happens automatically)</li><li>the daily rewards sent to the Node Operator will be halved (with the remaining half sent towards that day’s rebase) (happens automatically)</li><li>reduced rewards will continue for the duration of a cooldown period long enough to determine whether, immediately after service restoration by the Node Operator, subsequently received validator exit requests are processed in a timely manner.</li></ul></td>
</tr></tbody></table>

### Reputational Risk


<table>
<thead>
<tr>
<th width="134">ID</th>
<th width="120">Risk Group</th>
<th width="227">Risk Vector</th>
<th>Description</th>
</tr></thead>
<tbody>
<tr>
  <td id="risk-rer-1">RER1</td>
  <td>Process</td>
  <td>Mismanagement during incident</td>
  <td>Reputation damage due to mismanagement of slashing, downtime or access loss to keys</td>
</tr>
<tr>
  <td id="risk-rer-2">RER2</td>
  <td>People</td>
  <td>Negative appearance in public</td>
  <td>Damage to reputation due to bad behavior in public</td>
</tr>
<tr>
  <td id="risk-rer-3">RER3</td>
  <td>Process</td>
  <td>Mismanagement of Post-Incident</td>
  <td>Reputation damage due to mismanagement of Post-slashing, -downtime or access loss to keys</td>
</tr></tbody></table>




## Risk Mitigation Strategies

The Mitigation Strategies section serves as a go-to resource for node operators,
providing actionable insights and mitigation options to enhance the security, reliability, and efficiency of their operations.

Most of the best practices that optimize up-time, access control and general stability directly apply to operating a node properly.
However, there are a few risks that are very specific to running a node-operator, and to mitigate them,
higher levels of process segregation need to be achieved.

<a id="sec-mitigations-risk-management"></a>

### Risk Management

A core principle for mitigating risks is to actively identify and manage the risks.
This means understanding the particular risks, and the likelihood of something going wrong and the likely impact if that does occur.
That information enables a Node Operator to decide what level of risk is reasonable and how to prioritise available resources to mitigate risk.
Risk management decisions need to take into account any regulation that obliges a Node Operator to meet specific benchmarks or implement specific mitigation strategies
or other activities.

A first step for effective risk management is to document the potential risks, as well as the tools and processes currently in place.
Documentation needs to include an assessment of the relevant risks, what is acceptable,
and how each process or infrastructure component contributes to and protects against risks.

This enables Node Operators to identify activities that are not contributing to the business, or that actually increase the potential risks they face.
The accuracy, availability and completeness of this information is of crucial import.

Best practices include:
* Identify relevant staff and others responsible for identifying, assessing, and determining how to manage risks
* Ensure that every service, where possible, is configuration hardened using common benchmarks such as [CIS](https://www.cisecurity.org).
* Analyze each component in your infrastructure environment in terms of security, availability, processing integrity, confidentiality and privacy.
* Outline directly which risks are a high priority, and which ones are more acceptable, and the scenarios where it applies. For example, downtime comes only with an opportunity cost for ETH stakers, but may cause a slashing event in Polkadot.

#### Assessing risks

A standard industry approach to assessing risks is to consider the probability of an event occurring and the likely impact of that event.

If these are ranked on a linear numerical scale (e.g. probability between 0 and 1), and an approximate overall financial impact, they can be multiplied,
provide a ranking for priority of mitigating each risk.

Since the cost of risk mitigation varies considerably, the overall priority for addressing risk, or deciding that a given level of risk is acceptable,
generally depends on comparing the risk ranking with the cost of mitigation, and available resources.

##### Assessing Finanacial Impact

There are a number of factors to take into account when assessing the overall financial impact of a given risk, with the direct cost incurred as the most obvious.
It is important to understand the time required to mitigate the impact of an event, and the cost that will be incurred over that time.

An incident can incur a variety of costs in terms of employee time spent managing the incident, communication, and follow-up,
new mitigations implemented to mitigate concrete or reputational damage such as replacement or additional infrastructure,
as well as potential costs of compensation or legal costs.

It is also useful to consider opportunity costs such as reputational damage, or competitors taking advantage of an incident to promote themselves as a better alternative.

##### Assessing Incident Probability

Predicting the likelihood of an unexpected future event is generally difficult, and results are unlikely to precisely match the predictions.
Nevertheless it is important to consider the context of a specific operation and attempt accurate predictions.

There are best practices to do this effectively:

* Analyzing historical data to understand past trends and incidents (external, internal incidents, and near-miss incidents)
* Reviewing industry reports for insights into common risks and their fiscal consequences in similar scenarios
* Consulting with experts in the field to gain a comprehensive perspective on risk probabilities and impacts
* Utilizing risk assessment tools or software for a more data-driven analysis

##### Internal risk assessment is an important part of addressing all risks



</div>

<a id="sec-mitigations-tech-stack"></a>

### Technology Stack

In a nutshell: technology needs to serve the business goal, not the other way around.

To ensure this happens, it is important to consider both the business goals, and the available technology, and then use appropriate technology to meet those goals.

#### Local Anti-Slashing Database

To avoid double signing, validators maintain a history of messages they signed, usually stored in of a database.
In some cases, this feature is enabled by an external web3signer. The maintenance and protection of this database is crucial, as inconsistencies in this database may cause a double-signing event. The following items need to be in place:

* Persistence of anti-slashing database: Ensure that a persistent, not a temporary storage is used for the anti-slashing database.
* Assurance that slashing databases are connected and interacting properly.
* Protection against deletion of information, or the database itself.

<div class="info">

##### A local anti-slashing database helps address the following risks

* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3)
</div>

#### Doppelgänger Protection

While there are multiple measures possible to be taken to avoid two validator running with the same signing keys, one can also employ technologies that detect and prevent two validators running at the same time. This can be done using monitoring and alert systems, robust StatefulSet handling in Kubernetes to ensure no two containers with the same keys run at the same time, or pre-defined tools such as [DoppelBuster](https://github.com/SimplyStaking/DoppelBuster).

<div class="info">

##### Doppelgänger protection helps address the following risks

* [SLS2](#risk-sls-2)
</div>

#### Use of a Web3Signer

The main benefit of the use of Web3 signers is to have a service that is focused on the signing task directly, and comes with protection mechanisms.

Similar to the anti-slashing database, whenever used, a web3signer needs to be

* Connected to a storage system (such as a database), and it needs to be ensured that it is always connected.
* Ensured that they are not accidentally terminated.
* Ensured that the failover is using the same web3signer

<div class="info">

##### Use of a Web3Signer helps address the following risks

* [SLS2](#risk-sls-2), [SLS3](#risk-sls-3), [SLS14](#risk-sls-14), [SLS15](#risk-sls-15)
* [KEC5](#risk-kec-5), [KEC6](#risk-kec-6)
</div>

#### Client Diversity

Maintain a diverse set of clients for different protocols, in order to reduce blast radius in case one of the clients appears to have a protocol error or other bug. In some cases, migrate keys to different clients in case of a specific client error observed, such as startup issues after controlled update or bug in the latest version of the chosen client.

<div class="info">

##### Client diversity helps address the following risks

* [SLS6](#risk-sls-6), [SLS7](#risk-sls-7)
* [DOW2](#risk-dow-2), [DOW19](#risk-dow-19)
</div>

#### Distributed Validator Technology (DVT)

In order to avoid the single-point of failure problem for a node-validator without risking a slashing incident, DVT has been developed.

<div class="info">

##### DVT helps address the following risks

* [SLS1](#risk-sls-1), [SLS14](#risk-sls-14), [SLS15](#risk-sls-15)
* [KEC2](#risk-kec-2), [KEC3](#risk-kec-3), [KEC4](#risk-kec-4), [KEC5](#risk-kec-5), [KEC6](#risk-kec-6)
</div>

#### Lido-specific: Handling of Delinquent State

Node operators need to withdraw validators correctly, as they are otherwise put into a delinquent state. This results in an opportunity cost realised as monetary losses.

<div class="info">

##### Handling delinquent state helps address the following risks

* [SPS1](#risk-sps-1)
</div>

<a id="sec-mitigations-secret-management"></a>
### Information and Secret Management

Information management can mitigate many risks. One aspect is the management of highly confidential information, such as the management of signing keys or withdrawal keys, but it is also important to manage operational information.

#### Controlled and Audited Secret Access

Best practise for credential management is to use a [Single Sign on](https://en.wikipedia.org/wiki/Single_sign-on) system,
that gives users authorised access to secrets through e.g. [certificates](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Certificate-based_Authentication),
and/or [vault mechanisms](https://developer.hashicorp.com/vault/docs/secrets/ssh/signed-ssh-certificates).

In this way, everything is audited, and anomaly detection can be activated for those vaults.

Using multi-sig wallets, requiring authorization from multiple parties for specific actions, helps to ensure both that relevant access is monitored and that it is correctly controlled.

<div class="info">

#### Secret access management helps address the following risks

* [SLS5](#risk-sls-5)
* [KEC1](#risk-kec-1), [KEC3](#risk-kec-2), [KEC2](#risk-kec-3), [KEC4](#risk-kec-4), [KEC6](#risk-kec-6), [KEC8](#risk-kec-8), [KEC9](#risk-kec-9), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11)
* [GIR25](#risk-gir-25)
</div>

#### Encrypted Data

Many different components interplay while a staking operation is going on.
If confidential information is not protected by encryption, it can be intercepted and read during transmission.
There is also a risk of accidental or malicious leaking of stored information, which can be somewhat mitigated if that information is stored in encrypted form.

It is therefore crucial to ensure that confidential data is only stored and transmitted in an encrypted state.

<div class="info">

#### Data encryption helps address the following risks

* [SLS8](#risk-sls-8)
* [KEC5](#risk-kec-5), [KEC6](#risk-kec-6), [KEC7](#risk-kec-7), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11), [GIR10](#risk-GIR-10)
</div>

#### Cold Storage

Cold Storage, in particular "air-gapped" storage, can help protect information not used often such as withdrawal keys, private key generation materials, and the like,
by making it more difficult for malicious entities to access the information and by reducing the chance that it will be leaked in the event of accidentally publishing data.

<div class="info">

#### Cold storage helps address the following risks

* [KEC5](#risk-kec-5), [KEC6](#risk-kec-6), [KEC7](#risk-kec-7)
</div>

#### Key Management

It is important to protect private keys from accidental or malicious misuse, and in particular deletion.
It is not normal to provide broad access to unencrypted signing keys.

Best practices include ensuring that there are no single individuals with the capability to access or delete them, and having backups.
Modern vault systems enable the enforcement of policies to ensure that access to keys is only available with verified roles, and deletion is managed according to established protocols.

<div class="info">

##### Key management helps address the following risks

* [KEC2](#risk-kec-2), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11)
</div>

#### Key Rotation

Key rotation following a proper process help protect infrastructure from a potential misuse of credentials.

Best practise is generally "When in doubt, rotate". It is important to rotate keys whenever a data breach occurs,
but it is widely considered a good practise to require periodic key rotation to mitigate against exposure in the event that a data breach is undetected.

Keys to rotate include, but are not limited to:

* The Postgres database used by Web3Signer
* The vault itself
* Any SSH keys
* Any API keys for your cloud infrastructure

<div class="info">

##### Key rotation helps address the following risks

* [SLS8](#risk-sls-8)
* [GIR6](#risk-gir-6), [GIR7](#risk-gir-7)
</div>

#### Operational Information Management

Node operators are likely to  rely on a wide range of operational information,
including internal procedures, understanding software configurations, plans for future development, and employee management.

Best practise includes ensuring there is no single point of failure due to centralized information being held by a single external provider
or only being known to a single employee.

Documentation, even if rarely actively read by those responsible for operations (who presumably know their job), is important for many reasons including
- to enable onboarding new employees and service partners, or helping employees take on new roles
- to ensure smooth continued operation in the case that a key employee's role changes, particularly where they leave the organisation
- to enable accurate reporting as necessary
- to enable monitoring of operations and investigation of security incidents and other failures

##### Operational information management helps address the following risks:

* [FIN1](#risk-fin-1), [FIN7](#risk-fin-7), [FIN8](#risk-fin-8)
* [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS10](#risk-sls-10), [SLS14](#risk-sls-14)
* [DOW1](#risk-dow-1), [DOW4](#risk-dow-4), [DOW16](#risk-dow-18), [DOW16](#risk-dow-18)
* [KEC2](#risk-kec-2), [KEC3](#risk-kec-3), [KEC6](#risk-kec-6), [KEC9](#risk-kec-9), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11)
* [GIR4](#risk-gir-4), [GIR2](#risk-gir-25)
* [SPS0](#risk-sps-0)
* [RER1](#risk-rer-1), [RER3](#risk-rer-3)

##### Deletion protection

Loss of important information, in particular keys, can have a crippling impact. It is important to have mechanisms to preotect against, and recover from,
unintentional or malicious deletion of important data.

Best Practise includes having journaled backups of important information.

#### Deletion Protection helps address the following risks:

* [FIN7](#risk-fin-7)
* [SLS4](#risk-sls-4), [SLS10](#risk-sls-10), [SLS11](#risk-sls-11), [SLS12](#risk-sls-12)
* [DOW16](#risk-dow-18), [DOW16](#risk-dow-18)
* [KEC6](#risk-kec-6), [KEC9](#risk-kec-9)
* [GIR4](#risk-kec-4), [GIR13](#risk-gir-13)
* [RER1](#risk-rer-1), [RER3](#risk-rer-3)

<a id="sec-mitigations-access-management"></a>
### Access Controls and Access Management

Access Control covers physical access to devices and facilities, the ability to connect to servers through networks,
and the ability to perform specific tasks, such as getting answers to requests.

Three pillars of Access Control need to be considered:

* Authentication: Ensure that no service accepts requests without some form of authentication.
* Authorization: Clearly define who can read/write/update/delete resources. Ideally, this is not done on a per-user basis, but on a per-role basis.
* Audit: Ensure that all access is logged so that you can alert on anomalies. This is particularly important for login failures.

It is important that every piece of the infrastructure is secured from unauthenticated and unauthorized access.

A core principle to follow in granting authorization is [**least privilege**](#def-least-privilege). This is usually achieved by using [role-based access control](#rbac).

COSO Principles:
1. Keep an inventory of information assets
2. Restrict Logical Access to information assets through the use of access control software and rule sets.
3. Use sufficiently strong authentication systems.
4. Network Segmentation — Restrict access to nodes to a minimum set of IPs.
5. Manage Points of Access — Access to nodes inside the segmented area need to be controlled with authentication and authorization methods.
6. Proper credentials management for infrastructure software — A clear definition of each credential life-time is established and enforced.


Special considerations:

* Disable meta-data serving through public endpoints (like what server is running in what version).
* Limit the outbound traffic of a node that runs a certain service.
* Apply rate limits to ensure that internal services cannot unintentionally DDos each other.
* Where possible apply the use of authentication tokens that have a limited lifetime.



**Examples for best practices:**

* Creation and continuous analysis of Software Bill of Materials [SBOM](#ref-sbom).
* Use of Clients, roles and groups when using [AWS IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html).
* Have an internal virtual private network and only have well-defined endpoints be accessible from the web.
* Use a [Single Sign on](https://en.wikipedia.org/wiki/Single_sign-on) mechanism.

<div class="info">

#### Access control helps address the following risks

* [SLS8](#risk-sls-8), [SLS9](#risk-sls-9)
* [DOW7](#risk-dow-7), [DOW16](#risk-dow-16)
* [GIR1](#risk-gir-1), [GIR7](#risk-gir-7), [GIR9](#risk-gir-9), [GIR22](#risk-gir-22)
* [KEC4](#risk-kec-4)
* [SPS0](#risk-sps-0)


</div>

#### Least Privilege

The core of <dfn id="def-least-privilege">Least Privilege</dfn> is that access is only granted to those who need it, and only for as long as it is relevant. This means that an individual user's privileges are likely to change over time, and in particular any offboarding process includes a rapid revocation of user's assigned roles.

Almost all Least Privilege implementation is managed through role-based access control, where a set of roles are defined according to the tasks they need to perform.
Access rights are then based on holding a particular role,
with individual users assigned relevant roles that are revoked or deliberately renewed on a timely basis, to ensure that they can fulfil their designated tasks
without having authorizations they do not need.

Main outline from the COSO principles:

1. Creates or Modifies Access — Processes are in place to create or modify access.
2. Quick removal of access when needed
3. Use Role-based access control (RBAC)
4. Review of roles and permissions on a regular basis.

**Example best practices:**

* Disable privilege escalation mechanisms ([like executing as root user inside a Docker container](https://docs.docker.com/engine/reference/commandline/container_exec/), `docker exec -uroot`)
* [Impersonation mechanisms need to be audited (if it is enabled).](https://github.com/keycloak/keycloak/blob/main/docs/documentation/server_admin/topics/users/con-user-impersonation.adoc)* Credentials rotation needs to be in place to ensure that there is no interruption in the service when it is done.
* Off-boarding of a terminated employee does not take more than an hour. Ideally, one would only disable them inside a single-sign-on service such as [Cognito](https://aws.amazon.com/cognito/) or [Keycloak](https://www.keycloak.org).
* Tools need to be in place to analyze the permissions of certain users/programs and determine if these are too wide.
* Use of roles on the API endpoint level to determine the correct authorization.
* [Webserver authentication configuration of Microsoft IIS servers.](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/authentication/) Observe how different authentication methods are possible to be set there. `anonymousAuthentication` would allow anyone to access as `anonymous`, which is rarely the intention except for the starting page. `basicAuthentication` is better than nothing, but makes user management not scalable. `clientCertificateMappingAuthentication` and `digestAuthentication` are the better ways to also implement RBAC.


<div class="info">

##### Least privilege helps address the following risks

* [SLS8](#risk-sls-8), [SLS9](#risk-sls-9)
* [DOW16](#risk-dow-16)
* [GIR1](#risk-gir-1), [GIR5](#risk-gir-5), [GIR7](#risk-gir-7), [GIR9](#risk-gir-9), [GIR22](#risk-gir-22), [GIR25](#risk-gir-25)
* [KEC8](#risk-kec-8), [KEC11](#risk-kec-11)
* [SPS0](#risk-sps-0)

</div>

#### Employee Authorization Management

Ensuring that employees whose roles have changed do not have lingering credentials reduces the risk they others can misuse those credentials to cause harm.

Best practices is to ensure authorization changes are automated as part of management of employee lifecycles,
covering role changes as well as termination, transfer, and promotion procedures

<div class="info">

##### Employee authorization process helps address the following risks

* [SLS10](#risk-sls-10)
* [DOW17](#risk-dow-17)
* [GIR25](#risk-gir-25)
</div>

#### Managed Network Access to Nodes

Following the principles of defense in depth and [**least privilege**](#def-least-privilege), it is important that nodes are not directly accessible without permission, and that they do not leak information to the Web that can help malicious parties gain unauthorized access.


As well as controlling physical access where possible, it is best practice to ensure that nodes are only responsive through restricted access networks,
for example restricting web access through a VPN, and load-balancer that has a firewall,
as well as ensuring any remote access capability is clearly justified.
Further, it is important to ensure the hardware running nodes does not have extraneous software,
and does not allow generic probing mechanisms such as open port scans that can help malicious parties learn the topology of target systems.   

<div class="info">

##### Managed network access helps address the following risks

* [SLS12](#risk-sls-12)
</div>

#### Authentication Policies

Best practice is to use password and related authentication policies to ensure that access control mechanisms are sufficiently strong at every layer of the infrastructure. This can include appropriate requirements for the strength of passwords and the use of Multi-Factor Authentication as well as Multi-Signature requirements.

<div class="info">

##### Authentication policy helps address the following risks

* [SLS13](#risk-sls-13)
</div>

#### Managed Physical Access

This covers all physical devices that can access the Node, as well as all areas in which such devices are kept,
whether "on-premises", distributed, hosted by a third party, or remote mobile devices such as laptops.

Best practice for managing physical access includes ensuring that authorization is only granted as necessary,
following the principles of [Least Privilege](#def-least-privilege).
Generally this means some devices are physically segregated in areas where access is restricted according to function.
Note that this covers the use of devices authorized to access the networks that nodes operate on,
and is particularly important for devices authorized to access management and analytical functions of nodes.

Ideally all physical access to premises and facilities is monitored, to deter and determine whether the facility is subject to <dfn>piggybacking</dfn>.
This term refers to the situation where an unauthorized entrant is allowed in by someone who has a valid authorization for themselves.
In the context of remote operators' access through a computer, controlling this is particularly challenging in practice.

Piggybacking may occur inadvertently through politely holding a door for someone without checking that they have current valid authorization to enter,
negligently by allowing someone to enter for a legitimate purpose despite knowing that person does not have valid authorization,
or maliciously allowing someone to enter knowing that their purpose is nefarious.

In the inadvertent case, relevant mitigations include

- ensuring that all those with authorization understand the necessity to enforce physical access control,
- providing simple and effective ways to check authorization,
- ensuring that remote access devices as far as possible are dedicated to the defined purposes
(rather than allowing the use of general-purpose laptops that could be attacked when being used for a different task such as general email, or playing games).

To minimize negligently allowed access, it is important to ensure that access systems are effectively maintained and managed to ensure there is no good reason to allow an unauthorized person access.
This can range from the design of onboarding systems to the effectiveness of internal management feedback systems for discovering unanticipated problems faced by operators.

Best practice includes managing physical access with systems that can efficiently enable access to authorised parties (keycards, biometric scanners),
and monitor actual access such as visual verification that the authorized party is the one entering.

It is important to log and audit access sufficiently frequently to detect problems - see also [Monitoring](#sec-mitigations-monitoring).

<a id="sec-mitigations-environment"></a>
### Protection against Environmental Threats

Physical devices are subject to physical changes, including environmental issues such as temperature extremes that can cause damage,
and utility failures such as power or internet failure.

Mitigation strategies include the use of redundant infrastructure with failure detection and failover systems,
from backup node servers in different geographical locations to backup power supply e.g. through local batteries or power generation.
The level of mitigation that is appropriate depends on the level of risk, and the costs of both failure and mitigating failure.
These calculations mean economies of scale will enable larger-scale operations to be more robust than smaller ones, for a given price.

It is also important to ensure that facilities have appropriate protection from relevant environmental risks such as fire, flooding, or extreme wind,
and destructive physical attacks. Appropriate mitigations will depend in part on the specific location and nature of the facility.

<div class="info">

##### Protection against environmental threats helps address the following risks

* [SLS14](#risk-sls-14), [SLS15](#risk-sls-15)
* [DOW1](#risk-dow-1), [DOW5](#risk-dow-5), [DOW7](#risk-dow-7), [DOW8](#risk-dow-8), [DOW9](#risk-dow-9)
</div>

[Monitoring](#sec-mitigations-monitoring) can also identify specific conditions that adversely affect equipment and suggest that a lifecycle plan needs adjustment - whether writing off equipment destroyed by fire, or increasing preventive maintenance for physical access systems that are being used far in excess of expectations that drove the existing maintenance plan.

### Manage Equipment Life-cycle.

The lifecycle of equipment, most particularly node servers and computers used to access and manage them, is a determinant of overall security.

Best practices for lifecycle management include the ability to remotely pause, shut down, and wipe devices clean, although this needs to be considered in the context of the risk of malicious access to those capabilities.

[Monitoring](#sec-mitigations-monitoring) can also identify specific conditions that adversely affect equipment and suggest that a lifecycle plan needs adjustment - whether writing off equipment destroyed by fire, or increasing preventive maintenance for physical access systems that are being used far in excess of expectations that drove the existing maintenance plan.

<div class="info">


#### Equipment life-cycle management helps address the following risks

* [DOW3](#risk-dow-3)
* [KEC1](#risk-kec-1), [KEC5](#risk-kec-), [KEC6](#risk-kec-6), [KEC8](#risk-kec-8)
</div>

<a id="sec-mitigations-development-and-updates-"></a>
### Software Development and Update Process

#### Secure Development Life Cycle


**Examples for best practices:**

* Use of CI/CD pipelines like GitHub Actions
* Use of Linters
* Use of enforced review processes
* Not allowing to directly push to the main branch

<div class="info">

#### Secure development lifecycle helps address the following risks

* [GIR8](#risk-gir-8)
* [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [KEC8](#risk-kec-8)
* [GIR25](#risk-gir-25)
</div>


#### Comprehensive Testing for Changes to Code

A comprehensive test suite helps ensure changes do not introduce new vulnerabilities or situations that lead to operational failures.
Equally, it is important that someone other than the developer who produces Code changes reviews them.

Best practices is to enable this through a code repository, incorporating static and dynamic testing in the integration pipeline for code development.

Static and Dynamic analysis is important, as well as user testing wherever changes impact user interface or user-generated content.

Measuring test coverage, and requiring new tests that are reviewed as part of and code review,
help ensure that coverage is sufficiently comprehensive to detect errors that can arise through later changes.

<div class="info">

#### Testing and code review helps address the following risks

* [SLS4](#risk-sls-4), [SLS5](#risk-sls-5), [SLS6](#risk-sls-6), [SLS7](#risk-sls-7), [SLS18](#risk-sls-18)
* [DOW2](#risk-dow-2), [DOW6](#risk-dow-6), [DOW11](#risk-dow-11), [DOW12](#risk-dow-12), [DOW13](#risk-dow-13), [DOW14](#risk-dow-14),  [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [GIR11](#risk-gir-11), [GIR13](#risk-gir-13), [GIR18](#risk-gir-18), [GIR21](#risk-gir-21), [GIR23](#risk-gir-23), [GIR24](#risk-gir-24)
</div>

#### Validated Inputs and Outputs

Unchecked inputs are a major cause for overflow attacks and brute force. Ideally, the load balancer in front of the node filters out all traffic that has too large headers and payloads. Additionally, if JSON payloads are being used, it is important to validate them against the relevant schema.

<div class="info">

##### Input checking helps address the following risks

* [GIR8](#risk-gir-8)
</div>

<section id="sec-mitigations-manage-updates">

### Manage Software Updates

This is challenging for classically set up IT operations, but is straightforward if modern Infrastructure as Code principles are being used.

Main outline from the COSO principles:

* Manages Changes Throughout the System Life Cycle — To support system availability and processing integrity, any changes need to go through a well-defined process.
* Only perform authorized changes.
* Use a version control system for infrastructure.
* Maintain configuration of software in a code-base.
* Tests are in place for system changes.
* Have a ticketing system in place to document and review suggested changes.
* Have a controlled deployment.
* Certificate management for internal and external communication.
* Have a way to directly identify historical changes to the infrastructure.
* A templated configuration of IT and control systems is created and maintained.
* Have breaking-glass change mechanisms in place for emergency situations.
* Protect confidential information to be leaked or accidentally accessed in the change management system.


**Examples for best practices:**

* A lot of these points can be addressed by following the [GitOps lifecycle](https://about.gitlab.com/topics/gitops/#what-is-git-ops) to infrastructure.
* Using GIT also for infrastructure code and configurations.
* Use database migration systems such as [Liquibase](https://www.liquibase.org).

<div class="info">

#### Managing software updates helps mitigate the following Risks

* [SLS6](#risk-sls-6), [SLS7](#risk-sls-7)
* [DOW2](#risk-dow-2), [DOW11](#risk-dow-11), [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [GIR3](#risk-gir-3), [GIR18](#risk-gir-18), [GIR20](#risk-gir-20), [GIR21](#risk-gir-21), [GIR25](#risk-gir-25)
* [SPS](#risk-sps-0)
</div>

#### Avoid Customizing Third-party Software

Validator software, and other software validators use, is very often open source.
However, customising software can introduce errors.
In addition customizations can produce incompatibilities when software is updated.

This means that any customization introduces a need for continued extra testing,
in particular whenever relevant software is updated.
Customization also increases the risk that test coverage is inadequate,
so that a future error will not be found in pre-deployment testing and only discovered through a failure operating in production,
with attendant risks of reputational damage, direct losses, and increased cost for incident management.

<div class="info">

##### Not customising third-party software helps address the following risks

* [SLS7](#risk-sls-7)
* [DOW13](#risk-dow-13), [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
</div>

#### Managed Configuration Changes

Main outline from the COSO principles:

* Uses defined Configuration Standards, monitor and enforce them.
* Detect configuration drift.
* Detect unwanted sofware installed on nodes.
* Conducts Vulnerability and Configuration security Scans.

**References:**

* [[SOC2](#ref-soc2)] CC 7.1
* [[ISO 27001](#ref-iso-27001)] Annex A 8.9

**Examples for best practices:**

* This includes, but is not limited to:
  * Firewall configurations
  * Docker image setups
  * Container orchestration configurations
  * Database configurations
  * Webserver/Load balancer configurations
* Automated tools to track and scan for best practices are available (e.g. [CoGuard](https://www.coguard.io))
* Many pieces of software has defined configuration standards provided by [CIS benchmarks](https://www.cisecurity.org).

<div class="info">

##### Managing configuration helps address the following risks

* [GIR3](#risk-gir-3)
* [GIR4](#risk-gir-4)
* [KEC8](#risk-kec-8)
</div>

#### Protection against Supply-chain Malware

Protection against malware needs to be implemented on all assets and users need to exercise proper caution.

**Examples for best practices:**

- Regularly check the latest [CVE entries.](https://cve.mitre.org), to cover all software tools used. Tools such as [Trivy](https://github.com/aquasecurity/trivy) can help with this.
- Specifically check for any announcements of vulnerabilities before upgrading any software component

<div class="info">

##### Protection against supply-chain malware helps address the following risks

* [GIR15](#risk-gir-15), [GIR17](#risk-gir-17)
* [SPS0](#risk-sps-0)
</div>

#### Pre-deployment testing environments

Use separate tests and staging environments

This minimizes a potential blast radius. It is important to run any change (even an update of a validator software or Web3Signer) through a test environment first, and then roll it out in a staged fashion. If it causes some slashing event, it is then contained to the few nodes that it was rolled out to.



<div class="info">

##### Pre-deployment testing helps address the following risks


* [SLS6](#risk-sls-6), [SLS7](#risk-sls-7)
* [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [GIR11](#risk-gir-11), [GIR18](#risk-gir-18), [GIR20](#risk-gir-20), [GIR21](#risk-gir-21)
</div>

#### Containerized and Orchestrated Environments

Containerized and orchestrated environments are designed to reinforce security by automating many good practices, with mechanisms that have been widely tested in diverse environments. As tools that can be used well or badly, their best practice recommendations are important to ensure the the full benefits are realised.

<div class="info">

#### Containerized environments help address the following risks

* [GIR23](#risk-gir-23)
</div>

#### Process Automation

Human error is always a risk. An automated script, whether or not invoked by a human, can help minimise indavertent errors.

Another benefit of properly set up automation is to reduce the risk of exposing secrets.

When correctly configured pipelines and job-mechanisms such as GitHub Actions, Apache Airflow, or Apache Nifi can significantly reduce the potential for inadvertent errors to create problems

<div class="info">

##### Process automation helps address the following risks

* [SLS17](#risk-sls-17)
* [DOW19](#risk-dow-19), [DOW20](#risk-dow-20)
* [GIR16](#risk-gir-16) [GIR18](#risk-gir-18), [GIR19](#risk-gir-19), [GIR20](#risk-gir-20), [GIR21](#risk-gir-21),  [GIR25](#risk-gir-25)

</div>

</section>

<a id="sec-mitigations-monitoring"></a>
### Monitoring and Alerting

Monitoring dashboards are an important tool to identify risks and gain relevant data.
This is one reason that a requirement for monitoring is present in almost all compliance and security frameworks.

It is crucial to monitor not only high level business functions but all containers.
In particular, proper log collection makes it possible to dynamically verify low-level requirements,
including

* Web3Signer database has no CRUD operations going on (is it connected?)
* CPU/Memory does not spike suddenly in a container
* Network traffic in and out of container is within expected parameters
* Relays are functioning as expected
* Slashing related logs on validator nodes are accurate and correctly checked

Likewise, there needs to be useful and targeted alerting system based on the monitoring system.
It is important to learn that a potential problem has been identified as soon as possible, and act on it.
However, a system that overloads its watchers with alerts is likely to lead to <dfn>alert fatigue</dfn>,
where the alerts are ignored in practice because too often they are not identifying a real problem.

Alert systems can in turn drive automated emergency responses, ranging from capture of increased levels of detail,
through requesting additional authorization beyond the normal requirements, to full system shutdowns.
Again, there are important trade-offs between ensuring a highly responsive system, and one that is robust in the face of real-world variability.
For example, a system that can automatically suspend multisig transactions unless they are authorized within a short time is not always appropriate,
because it can interfere with normal operations over a high-latency network or where a number of individuals are expected to coordinate extensively,
taking a significant amount of time, before authorizing a particular action.

Main outline from the COSO principles:

* Implements Detection Policies, Procedures, and Tools
* Design and improve on Detection Measures — Ideally capture unauthorized access, suspicious traffic, etc.
* Implement filters to not even let suspicious requests contact the back-end.
* Check frequently if detection tools are working correctly.
* Have one or more centralized dashboards to aggregate the data and present it in a digestible way to a human observer.


#### Beacon Chain Monitoring

* **Slashing Events:** Monitor the beacon chain for any slashing events.
* **Anti-Slashing Database:** Regularly poll the local node to ensure the anti-slashing database is enabled and functioning correctly.
* **Impact of Slashing:** Assess and monitor the broader impact of any slashing incidents on the network.
* **Relay List Monitoring:** Monitor the relay list for availability metrics and load balance capabilities between various relayers for downtime conditions.
* **Chain Reorganizations:** Track events and causes of chain reorganizations
* **Non-finalized Events:** Monitor events preventing the consensus layer from confirming finality
* **Special Software Conditions:** Monitor major software upgrades requiring specific durations and events that will conclude the upgrade

#### Node and System Health

* **Node Health Metrics:** Monitor key metrics like CPU, memory, restarts, and uptime of nodes.
* **System Configuration:** Monitor system configuration settings in real-time and continuously.
* **Key Usages:** Track the usage of critical system keys.
* **App-specific:** App specific metrics  (e.g. metrics for Dirk, Vouch)

#### Security and Compliance

* **Access Control and Logs:** Monitor access to nodes, with heightened attention to abnormal configuration changes or changes in sensitive systems
such as 2FA configuration or VPNs.
* **Phishing and Endpoint Protection:** Monitor for phishing attacks and ensure the security of endpoint protection systems, both for employee devices and infrastructure nodes.
* **Bastion Nodes:** If applicable, monitor bastion or connection nodes.
* **Suspicious Internal Interactions:** Watch for any suspicious internal interactions with infrastructure, cloud security platforms, or network monitoring solutions.
* **Relay Compliance:** Monitor relay compliance aspects and availability metrics.

#### Upgrade and Code Management

* **Upgrade Process:** Monitor the upgrade process, including client code source, notification channels, bug reports, and community disclosures.
* **Customized Code in Testnet:** Monitor any new custom code deployed in the testnet.

#### Hardware and Network

* **Baremetal and Network Equipment Health:** Monitor the health of bare metals and networking equipment, including internet and peering connectivity.
* **Predictive Models:** Use predictive models for future malfunctions and equipment replacement needs.
* **Capacity and Resource Usage:** Track capacity usage, processing memory, and CPU.
* **Peering Connectivity:** Monitor both internal and external network peering connectivity.
* **Firewall Configuration and Metrics:** Keep an eye on firewall configuration changes or unexpected increases in drop metrics.

#### Cloud and Infrastructure

* **Cloud Monitoring Solutions:** Utilize cloud monitoring solutions to keep track of uptime and internal issues.
* **Cloud Service Notifications:** Stay informed about cloud service announcements regarding expected downtime and maintenance.


<div class="info">

Take a look at [collection-of-tools-scripts-and-templates.md](../mitigation-and-controls-library/collection-of-tools-scripts-and-templates.md) for tool examples to perform the monitoring of some of the metrics mentioned above, as well as:

* Cognito's [Userpool Addons for auditing authentications](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html).
* Filtering and anaysis of anomalies can be done in AWS using the [WAF module](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html).
* An example for monitoring software is the [ELK stack](https://www.elastic.co/elastic-stack/).
* A very common centralized dashboard is [Grafana](https://grafana.com) - an example of [alerting setup in Grafana.](https://grafana.com/docs/grafana/latest/alerting/set-up/)

</div>


<div class="info">

#### Monitoring can help address the following risks:

* [SLS8](#risk-sls-8), [SLS16](#risk-sls-16)
* [DOW6](#risk-dow-6), [DOW15](#risk-dow-15)
* [GIR4](#risk-gir-4), [GIR13](#risk-gir-13)


</div>

<a id="sec-mitigations-incident-response"></a>
### Incident Response

An <dfn id="def-incident-response-plan">Incident Response Plan</dfn> documents procedures for managing security incidents and events,
as guidance for employees or incident responders who believe they have discovered, or are responding to, a security incident.
A well-documented Incident Response Plan helps employees in a high-stress situation by providing a reminder of all important actions and considerations.
To be useful, it is necessary that relevant employees know the plans exist, and how to find them.


Best practices for Incident response plans include

- Identify relevant participants in advance, with well-defined decision-making responsibilities.
  Redundancy against specific failures such as a key employee being unavailable is important.
- Clear information about how to investigate and triage incidents,
  including when to notify and involve particular participants and how to escalate issues to the most appropriate person or team.
- Define clear procedures to follow for specific sets of circumstances. Where it is possible and appropriate, automated responses and alerting triggered by
  [Monitoring](#sec-mitigations-monitoring) can help ensure rapid response.
- Data collection and distribution to enable effective response, external communication, and "Post Mortem" analysis
- Identify relevant Stakeholders and define communication strategies for both internal and external communications

<a id="sec-mitigations-response"></a>
#### Identify and Respond to Security Incidents

Main outline from the COSO principles:

* Assigns Roles and Responsibilities in case of a security event.
* Contains Security Incidents — Ideally incidents can be contained within a short period of time.
* Communication protocols are in place to inform affected parties.
* Vulnerabilities need to be identified.
* Have a proper incident response plan in place, and review it periodically.
* Communicates and Reviews Detected Security Events — Either take direct actions, or create tickets for future detection of events of a similar kind.
* Evaluate the identification of and response to incidents on a regular basis.



**Examples for best practices:**

* There are several incident response templates available.
  - One example is [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final).
  - Another can be found at:
  [https://docs.google.com/document/d/1ynZfeMh3vxZu7Juh-f34b50_3WHgejiL/edit?usp=sharing\&ouid=117284374075970906179\&rtpof=true\&sd=true](https://docs.google.com/document/d/1ynZfeMh3vxZu7Juh-f34b50_3WHgejiL/edit?usp=sharing\&ouid=117284374075970906179\&rtpof=true\&sd=true)

<div class="info">

##### Identifying and responding to security incidents helps address the following risks

* [RER1](#risk-rer-1)
* [RER3](#risk-rer-3)
</div>

#### Analyze Security Events and Learn from Them

This is often referred to as a "<dfn id="def-post-mortem">Post-Mortem</dfn>",
and is used to learn from the event and improve relevant Incident Response Plans

Main outline from the COSO principles:

* Develops and Implements Procedures to Analyze Security Incidents.
* Whenever possible, determine the root cause.
* Implement necessary changes to prevent similar disasters.

<div class="info">

##### Analyzing security events helps address the following risks

* [DOW10](#risk-dow-10)
* [GIR6](#risk-gir-6)
* [GIR7](#risk-gir-7)
</div>

#### Disaster Recovery Plan

A Disaster Recovery Plan is an Incident Response Plan that gives guidance on recovering one or more information systems at an alternate facility,
in response to a major hardware or software failure including the partial or complete destruction of facilities.

Best practices include maintaining copies of production environments to enable fast restoration.

<div class="info">
Sample Disaster Recovery Plan templates:

* [National Institute of Standards & Technology Template](https://csrc.nist.gov/files/pubs/sp/800/34/r1/upd1/final/docs/sp800-34-rev1_cp_template_high_impact_system.docx)
* [#automation](../mitigation-and-controls-library/collection-of-tools-scripts-and-templates.md#automation "mention")

COSO principles:

* Quick restoration of affected environments.
* Whenever possible, determine the root cause.
* Implement necessary changes to prevent similar disasters.

##### Disaster recovery plans help address the following risks:

* [GIR19](#risk-gir-19)

</div>

#### Incident Simulations

These are also known as "<dfn id="def-pre-mortem">Pre-Mortems</dfn>".

Regular simulations of implementing an Incident Response Plan ensure that relevant personnel are familiar with them and can follow them when necessary.
"Pre-Mortems" simulating or "war-gaming" a specific failure also
tests that those procedures are tested to give some idea of whether they are appropriate and adequate,
and often motivates people to think about other risks, and whether appropriate procedures and mitigations are in place.

There are many possible approaches to an incident simulation, and may eventualities that they can cover. As well as a highly detailed scenario, example topics could include variations on themes such as

* Unauthorized users gain access to the servers and set about making mischief
* A complex security compromise, where details are not immediately available
* A specific scenario (environmental disaster, utility failure, operational error) results in downtime


Articles such as [Premortem](#ref-premortem)
offer further information on how to plan and implement simulations, and how to derive the maximum benefit from them.

#### Incident Communication

As well as direct financial losses, security incidents can also result in substantial reputational damage.
Appropriate <dfn id="def-incident-communication">Incident Communication</dfn> with stakeholders about security incidents, both during and after the relevant incident, can significantly mitigate this risk.

It is important to note that inappropriate communication during an incident can increase the damage.
External communication has to balance stakeholders' need for information that enables them to respond in a well-informed manner
against the importance of providing clear information with as much certainty as feasible that it will not later be contradicted.

Best practice for external communication about an incident includes providing a detailed post-incident summary.

<a id="sec-mitigations-general"></a>
### General Measures

* General cyber security (Firewall, Intrusion Detection System, ....)
* Check the uptime promise of cloud provider (minimum three 9s)
* Failover system (also in different locations)
* Conduct an internal special study of failover and load balancer strategies
* Ensure stable Internet connection of the System (Cloud, Bare Metal, ....)
* Ensure stable Power connection of the System (Cloud, Bare Metal, ....)
* Ensure proper load-balancer and firewall at the front
* Only necessary software on the relevant servers
* Being able to switch the relayer or disconnect from the relay
* Safety training

<a id="sec-controls-catalog"></a>
## Controls Catalog

This section contains controls that are material to Node Operator risks.
Some of these control criteria correspond to similar controls from at least three common frameworks.

* [OWASP Top 10](https://owasp.org/www-project-top-ten/)
* [ISO 27001](#iso-27001)
* [SOC2](#soc2)

Where relevant, corresponding controls from those frameworks are identified and linked from ValOS controls.

<a id="sec-controls-risk-management"></a>
### Controls for Risk Management

#### Ensure Activities Support Operational Goals

Node Operators MUST document how their processes and tools serve their business goals

##### External Controls for aligning processes and tools with business goals

* [[SOC2](#ref-soc2)] CC 5.2

<div class="info">

#### Assessment of activities' relevance helps address the following risks

* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS5](#risk-sls-5), [SLS11](#risk-sls-11), [SLS12](#risk-sls-12), [SLS13](#risk-sls-13), [SLS14](#risk-sls-14), [SLS15](#risk-sls-15), [SLS16](#risk-sls-16), [SLS17](#risk-sls-17), [SLS18](#risk-sls-18)
* [DOW16](#risk-dow-16), [DOW18](#risk-dow-18)
* [GIR5](#risk-gir-5)
</div>

#### Document Risk Assessments

Node Operators MUST document their assessments of risks, and what risks they class as acceptable

##### External controls for risk assessment

* [[SOC2](#ref-soc2)] CC 3.1

<div class="info">

##### Internal risk assessment is an important part of addressing all risks

</div>

#### Process Controls

Node Operators MUST ensure that processes for risk mitigation are followed in practice

<a id="sec-controls-info-secrets"></a>
### Controls for Information and Secret Management

#### Key Management

Node Operators MUST implement appropriate key management procedures

Best Practise includes following a commonly recognised key management standard such as

- [[CCSS](#ref-ccss)]: a set of requirements for securing Cryptocurrency systems, focusing on Key Management. Certification for systems is available at three levels, and is granted by certified CCSS Auditors.
- [[BSSC KMS](#ref-bssc-kms)] a set of requirements for Key Management designed for organisations working in blockchain, allowing self-attestation of conformance.

#### Identity Management

Node Operators MUST track identity and roles of employees and service partners

This includes off-boarding mechanisms, tracking assigned roles, and ensuring compliance with privacy regulations

##### Relevant external controls for identity management

* [[ISO 27001](#ref-iso-27001)] Annex A 5.16

<div class="info">

#### Identity management helps address the following risks
* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
</div>

#### Document Vendors and Partner Risk

Node Operators MUST implement documented procedures for evaluating and reviewing counterparty risks from vendors and partners

* Establishes Requirements for Vendor and Business Partner Engagements.
* Assesses Vendor and Business Partner Risks - A process is in place to evaluate existing vendors.
* Ensure that previously identified issues with vendors are fixed and regressions may be identified.
* Implements Procedures for Terminating Vendor Relationships.

##### Relevant external controls for counterparty risk management

* [[SOC2](#ref-soc-2)] CC 9.2

<div class="info">

##### Counterparty risk management helps address the following risks

* [SLS8](#risk-sls-8), [SLS9](#risk-sls-9)
* [GIR5](#risk-gir-5)
* [DOW1](#risk-dow-1), [DOW19](#risk-dow-19)
</div>

#### Manage Information Lifecycles


Node Operators MUST document and follow information lifecycle processes for important operational information

This includes the definition and enforcement of retention periods, and the use of thorough deletion mechanisms, such as [shred](https://man.archlinux.org/man/shred.1.en).

<div class="info">

##### Relevant external controls for information lifecycles:
* [[ISO 27001](#ref-iso-27001)] Annex A 8.10

#### Information Lifecycle management helps address the following risks:
* [SLS10](#risk-sls-10)
* [DOW17](#risk-dow-17)
</div>

#### Backup and Protect Data against Loss

Node Operators MUST implement backup procedures, at minimum daily, for important operational data

Backup Procedures SHOULD produce journaled backups covering relevant retention periods.

Node Operators MUST implement protection against accidental or malicious deletion of data.

These requirements cover all information required by controls in this specification.

##### Protection against information loss helps address the following risks:
* [FIN7](#risk-fin-7)
* [SLS4](#risk-sls-4), [SLS10](#risk-sls-10), [SLS11](#risk-sls-11), [SLS12](#risk-sls-12)
* [DOW16](#risk-dow-18), [DOW16](#risk-dow-18)
* [KEC6](#risk-kec-6), [KEC9](#risk-kec-9)
* [GIR4](#risk-kec-4), [GIR13](#risk-gir-13)
* [RER1](#risk-rer-1), [RER3](#risk-rer-3)

#### Record Important Operational Knowledge

Node Operators MUST record and maintain important operational information

Best practice is to use a documentation management system. While this is likely to have different levels of access control, it is important that no information is available to only one employee.

##### Recording operational knowledge helps address the following risks:
* [FIN1](#risk-fin-1), [FIN7](#risk-fin-7), [FIN8](#risk-fin-8)
* [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS10](#risk-sls-10), [SLS14](#risk-sls-14)
* [DOW1](#risk-dow-1), [DOW4](#risk-dow-4), [DOW16](#risk-dow-18), [DOW16](#risk-dow-18)
* [KEC2](#risk-kec-2), [KEC3](#risk-kec-3), [KEC6](#risk-kec-6), [KEC9](#risk-kec-9), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11)
* [GIR4](#risk-gir-4), [GIR2](#risk-gir-25)
* [SPS0](#risk-sps-0)
* [RER1](#risk-rer-1), [RER3](#risk-rer-3)

<a id="sec-controls-access"></a>
### Controls for Access Control

#### External Controls For Access Management - General

* [[OWASP Access Control](#ref-owasp-access-control)]
* [[ISO27001](#ref-iso27001)] Annex A 5.15
* [[SOC2](#ref-soc2)] CC 6.1

#### Authentication required for services

All services MUST require appropriate authentication privileges.

For example, a Node does not respond to anonymous requests from an unknown user.

#### Segment Networks to Limit Access

Networks SHOULD be segmented, to restrict access to systems that are identified as needing it.

Nodes MUST NOT respond to requests from outside a defined network, except those that are explicitly defined as necessary.

Fulfilling this requirement means maintaining a whitelist of individual services that are authorized to respond to requests from broader networks.

##### Relevant Risks

* [DOW10](#risk-dow-10)
* [GIR9](#risk-gir-9)
* [KEC8](#risk-kec-8)

##### Relevant external controls

* [[ISO 27001](#ref-iso-27001)] Annex A 8.22

#### Access to physical hardware is limited

Entry to physical server locations MUST require authorization

For example, a biometric scan or the use of a keycard.

#### Least Privilege is applied to individuals and software

Software MUST NOT run with, and a user MUST not have a higher level of privilege than necessary.

For example, check that software does not run as root, that users do not log in directly with root privileges, and software and users are granted fine-grained access based on need rather than broad-based access for simplicity.

##### Relevant risks for Least Privilege

* [KEC11](#risk-kec-11)
* [GIR7](#risk-gir-7)


##### External Controls for Least Privilege

* [[SOC2](#ref-soc2)] CC 6.3
* [[ISO 27001](#ref-iso-27001)] Annex A 8.2
* [[ISO 27001](#ref-iso-27001)] Annex A 8.18


#### Regularly Review Access Rights Management

A review of Access Rights MUST take place regularly

This covers both the processes and tools for granting and revoking access rights, and verifying that they are effectively managing access rights
according to the relevant principles ([**Least Privilege**](#def-least-privilege), [**Role-based management**](#rba)).
Best practice for this review includes:

- analyzing access logs for physical access to hardware, and ensuring authorized individuals are not given access to hardware
- verifying access to signing keys is limited to individuals whose roles mean they need it, and that all who need that access have it
- ensuring that processes are effectively followed and meet the Node Operator's business needs
- verify that software is run in a way that minimises its access

##### Relevant Risks For Access Rights Review

* [SLS8](#risk-sls-8), [SLS9](#risk-sls-9), [SLS10](#risk-sls-10), [SLS11](#risk-sls-11), [SLS12](#risk-sls-12), [SLS13](#risk-sls-13)
* [DOW16](#risk-dow-16), [DOW17](#risk-dow-17), [DOW18](#risk-dow-18)
* [GIR1](#risk-gir-1), [GIR5](#risk-gir-5), [GIR7](#risk-gir-7)

##### Relevant external controls For Access Rights Review

* [[ISO 27001](#ref-iso-27001)] Annex A 5.17
* [[ISO 27001](#ref-iso-27001)] Annex A 5.18
* [[ISO 27001](#ref-iso-27001)] Annex A 8.18

#### Protect Data in Transit and Storage

All data in transit MUST be encrypted, and SHOULD use the most direct transmission available.

This covers all services that communicate data, such as Databases, Web servers, Load balancers, Authentication systems, CI/CD pipeline tools, etc.
Best practices include ensuring that the latest version of TLS is being used, with secure algorithms.

##### Relevant Risks

* [SLS11](#risk-sls-11), [SLS12](#risk-sls-12), [SLS13](#risk-sls-13)
* [DOW18](#risk-dow-18)
* [GIR10](#risk-gir-10)
* [KEC1](#risk-kec-1), [KEC2](#risk-kec-2), [KEC3](#risk-kec-3), [KEC4](#risk-kec-4), [KEC5](#risk-kec-5), [KEC6](#risk-kec-6), [KEC7](#risk-kec-7), [KEC8](#risk-kec-8), [KEC9](#risk-kec-9), [KEC10](#risk-kec-10), [KEC11](#risk-kec-11)

##### External Controls for Encrypted Data

* [[OWASP Cryptographic Failures](#ref-owasp-cryptographic-failures)]
* [[SOC2](#ref-soc2)] CC 6.7

COSO principles:
* Transmission of sensitive data needs to be restricted.
* Data in transit needs to be encrypted.

<section id="sec-controls-monitoring">

### Controls for Automated Monitoring

Risks that Automated Monitoring can help mitigate:

* [DOW1](#risk-dow-1)

#### Log privileged access

Any operation that requires privileged access MUST be logged.

Any assignment of a key, or assignment of a role to or removal of a role from a particular key, MUST be logged.

This includes monitoring software that has privileged access.

##### Relevant external controls

* [[ISO 27001](#ref-iso-27001)] Annex A 8.18

#### Log personnel changes

Every change in the status of people who have access to any function of the Node, or physical access to any hardware, MUST be logged.

#### Log slashing events

Any event that results in slashing MUST be logged.

There SHOULD be a procedure in place to determine whether there are repeating patterns,
that identify a failure (e.g. software bugs, operating procedures) which can be rectified.

#### Monitor hardware and network performance

Logs MUST provide a sufficiently detailed view of hardware and network performance to enable upgrade needs to be forecast,
and to alert if validators are operating with excess latency.

Tools such as [Zabbix](tool-zabbix) can also display a live feed of CPU and memory usage of each compute instance.

#### Relevant external controls for Automated Monitoring

- [[SOC2](#ref-soc2)] A 1.1
- [[SOC2](#ref-soc2)] CC 7.2
- [[ISO 27001](#ref-iso-27001)] Annex A 8.16
- [[ISO 27001](#ref-iso-27001)] Annex A 8.21

</section>

<a id="sec-controls-environment"></a>
### Controls for Environmental Threat Management

#### Manage Environmental Threats

Node Operators SHOULD have processes in place to manage environmental threats

This includes monitoring for such threats and physically hardened facilities (e.g. fire- and flood-resistant server rooms),
and physically decentralized infrastructure. It can also incorporate the use of DVT or related approaches to managing physical decentralization.

##### Relevant external controls for environmental threats

* [[ISO 27001](#ref-iso-27001)] Annex A 7

##### Environmental threat management helps address the following risks

* [SLS14](#risk-sls-14), [SLS15](#risk-sls-15)
* [DOW1](#risk-dow-1), [DOW5](#risk-dow-5), [DOW7](#risk-dow-7), [DOW8](#risk-dow-8), [DOW9](#risk-dow-9)

#### Manage Equipment Lifecycles

Node Operators SHOULD have processes in place to manage equipment lifecycles

This includes monitoring performance and performing preventive maintenance, upgrades, or replacing equipment as appropriate,
as well as processes that ensure equipment is correctly retired including removing data and any hardware-based authorization.

##### Relevant external controls for equipment lifecycles
* [[ISO 27001](#ref-iso-27001)] Annex A 7

#### Equipment life-cycle management helps address the following risks

* [DOW3](#risk-dow-3)
* [KEC1](#risk-kec-1), [KEC5](#risk-kec-), [KEC6](#risk-kec-6), [KEC8](#risk-kec-8)


<a id="sec-controls-updates"></a>
### Controls for Development and Update Process

#### Relevant external controls for managed software updates

* [[SOC2](#ref-soc2)] CC 8.1
* [[ISO 27001](#iso-27001)] Annex A 8.32

#### Develop Software as Secure by Design

Code development MUST follow processes to avoid introducing security risks

This is a broad area. A few specific controls are included in this specification, but this requirement is intended to ensure a general production philosophy.

##### Relevant external controls for secure development
* [[ISO 27001](#iso-27001)] Annex A 8.25

#### Verify Outsourced Development

Main outline of the Information security controls reference:

Node Operators MUST review custom-developed code provided by third parties

Best practice is to perform both internal and independent external audit, and to ensure the identity of the coders is known.
Likewise, in best practice third-party code developers are only given access to code they need to do their work, are held to high standards of confidentiality,
and work with a well-defined set of expectations

##### Relevant external controls for verifying outsourced development
* [[ISO 27001](#ref-iso-27001)] Annex A 8.30

<div class="info">

#### Verifying outsourced development helps address the following risks

* [GIR24](#risk-gir-24)
</div>

#### Follow Update Procedures

Node Operators MUST document procedures for updates to code

#### Use Code Repositories

Source code MUST be managed in a repository

Deployed production code MUST NOT be directly editable

This covers all changes to code, including when it is necessary to roll back an upgrade.

#### Check Third-party Code for Vulnerabilities before Updating

Updates to third-party software MUST be checked for vulnerabilities before deployment

This covers verifying that all software updates, including validators and other nodes, have been audited to ensure they are not introducing known or new vulnerabilities.

##### External controls for checking third-party software

* [[ISO27001](#ref-iso-27001)] Annex A 8.7
* [[ISO27001](#ref-iso-27001)] Annex A 8.30

#### Validate Inputs and outputs

Code MUST verify that input is safe before operating on it

Code MUST NOT produce invalid outputs

Components SHOULD use [[CORS](#ref-cors)] and [[CSP](#ref-csp)] to protect against Server Side Request Forgery

These requirements ensure that data passed between software components can be handled safely by the receiving component. It includes data entered manually by users.

Best practice includes using JSON [schema](https://json-schema.org) and [schema evolution techniques](https://en.wikipedia.org/wiki/Schema_evolution),
and defined minimum and maximum input sizes and MIME types ([Microsoft IIS example](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/mimemap)).

Multiple tools can help meet these requirements, including
* [ajv](https://www.npmjs.com/package/ajv), [validatorjs](https://github.com/validatorjs/validator.js), [Apache Ranger](https://ranger.apache.org)
* ORM systems exist for almost all programming languages and frameworks. Some of the most common ones are [Hibernate](https://hibernate.org/orm/documentation/getting-started/), [TypeORM](https://typeorm.io) and [SQLAlchemy](https://www.sqlalchemy.org).
* In the Apache web-server, one can control the request size of different pieces of the request:
  * [LimitRequestBody](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestbody)
  * [LimitRequestFields](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestfields)


##### External controls for validating data passed between components

* [[OWASP SSRF](#ref-owasp-ssrf)]
* [[SOC2](#ref-soc2)] PI 1.2
* [[SOC2](#ref-soc2)] PI 1.3

#### Data validation helps address the following risks

* [GIR8](#risk-gir-8), [GIR16](#risk-gir-16)

</div>


#### Ensure Good Test Coverage

Node Operators MUST have thorough test coverage of their software and operating procedures

There is no magic percentage figure, but ideally unit tests and integration tests cover every funtionality and interaction
managed by code the Node Operator uses, whether self-managed or provided by a third party.

##### Relevant external controls for test coverage

* [ISO 27001](#iso-27001) Annex A 8.29

#### Test All Interactions Impacted by Software Updates

Updates MUST include an Audit of ALL Code and User Interactions they impact

This means testing not just the new code deployed, but also existing code that interacts with anything the update changes, to ensure that integration is not introducing a vulnerability. This extends to non-blockchain code used to interact with the Validator, where applicable.

#### Deploy via staging test environments

Updates MUST be tested on a staging environment that as closely as possible matches the proposed deployment environment before deployment as "production" on a live network.

##### Relevant external controls for pre-deployment testing

* [ISO 27001](#iso-27001) Annex A 8.31

#### Maintain Emergency Rollback Procedures

Node Operators MUST have a process to enable emergency rollback of upgrades

<a id="sec-controls-response"></a>
### Controls for Incident Response Planning

#### Relevant external controls for incident response planning

* [SOC2](#soc2) CC 7.4
* [SOC2](#ref-soc2) CC 9.1 of Trust Services Criteria

Incident Response Planning helps address almost all risks faced by Node Operators

#### Document Adequate Incident Response Plans

The Node Operator MUST have documented [Incident Response Plans](#def-incident-response-plan) corresponding to all risks identified in this specification.

#### Document Disaster Recovery Plans

The Node Operator MUST have documented [Disaster Recovery Plans](#def-disaster-recovery-plan) corresponding to risks identified in this specification
that lead to destruction of crucial data or loss of assets.

##### Relevant external controls for disaster recovery plans

* [SOC2](#soc2) CC 7.5

##### Disaster recovery plans help address the following risks:

* [GIR19](#risk-gir-19)

#### Plan Incident Follow-up

[Incident Response](def-incident-response-plan)
and [Disaster Recovery](#def-disaster-recovery-plan) plans MUST include revising the relevant plans whenever they are activated, based on lessons learned.

This covers both responses to real incidents and Simulated activation, or "pre-mortems".

##### Analyzing security events helps address the following risks

* [DOW10](#risk-dow-10)
* [GIR6](#risk-gir-6)
* [GIR7](#risk-gir-7)

##### Relevant external controls for analyzing security events

* [SOC2](#soc2) CC 7.3

#### Perform Regular Incident Response Simulations

Node Operators MUST perform a simulated Incident and activation of the associate [Incident Response](def-incident-response-plan)
or [Disaster Recovery](#def-disaster-recovery-plan) plans at least twice per year.

#### Plan Incident Communication

Node Operators MUST document [Incident Communication](#def-incident-communication) strategies or policies

This requirement includes internal and external communication, both during and after incidents.

<a id="sec-controls-general"></a>
### Controls for General Security Measures

#### Verify Counterparty Compliance

Node Operators MUST verify that third parties providing services, or with whom the Node Operator contracts, is in compliance with relevant standards (including this one) and regulations

This includes areas such as the uptime guarantees of cloud providers and other core counterparties,
response times and Service Level Agreements, security procedures, and the like as well as relevant regulatory compliance.

##### Counterparty verification helps mitigate the following risks

* [SLS8](#risk-sls-8), [SLS9](#risk-sls-9)
* [GIR5](#risk-gir-5), [GIR24](#risk-gir24)
* [DOW1](#risk-dow-1), [DOW19](#risk-dow-19)
* [SPS0](#risk-sps-0)

##### Relevant external controls for counterparty verification

* [[ISO 27001](#iso-27001)] Annex A 8.30
* [[SOC2](#ref-soc2)] CC 9.2

#### Manage Counterparty Relationship Lifecycles

Service agreements MUST specify termination procedures and obligations





### Network services

Main outline of the Information security controls reference:

* Any traffic needs to be monitored, analyzed and potentially alerted on.

**References:**

* [[ISO 27001](#ref-iso-27001)] Annex A 8.21

**Examples for best practices:**

* Segmentation of networks using security groups and subnets.
* Encryption in transit should always be enabled.
* Use and enforcement of IP whitelists

<div class="info">

#### Network management helps address the following risks

* [DOW10](#risk-dow-10)
</div>


<section id="sec-communications-strategy">

## Communications Strategy

There are two core parts to a Nore Operator's communication strategy:
Normal <dfn>Operational Communication</dfn> provides information about ongoing operations, to ensure coinfidence in and transparency of everyday operations.
<dfn>Incident Communication</dfn> is the collection of communications processes that occur when an exceptional security incident occurs that could adversely affect the normal operations, or the users of a system.

Both rely on understanding the Stakeholders, and developing approriate communication channels and procedures to ensure those stakeholders have timely access to relevant information.

### Stakeholder Overview

Some key stakeholders are <dfn>Known Stakeholders</dfn>, who have an identity known to the Node Operator
that includes at least one direct communications cannel such as messaging, email, or telephone. These typically include

* High stake investors - with whom the Operator could have contractual obligations
* Service Partners, who might be involved in operating and managing protocols and requiring governance votes, or hosting, managing or operating infrastructure as part of the node operation setup
* Media channels, platforms, and accounts covering technical and non-technical news and reports
* Other Node Operators running validators on the same network
* Staff such as those developing and maintaining critical node operations software
* Individuals or organizations using additional service provided by Node Operators (e.g., API users, customers for white-label solutions etc.)
* Corporate Regulators - who can require that Node Operators provide them with specific information, but do not necessarily communnicate with Node Operators on an individual basis

Node operators will almost certainly also have <dfn>Anonymous Stakeholders</dfn>, who might follow a Node Operator's public information channels,
or operate independently, but who do not provide individual communication information to Operators.

These can include

* Low stake investors and potential investors
* Communities involved in the ecosystem for motives as diverse as lobbying regulators, developing technical standards,

As well as many of the types of Stakeholder who also become Known Stakeholders, such as High stake investors, Media and  Other Node Operators.

### Communication Channels

Stakeholders' preferences for communication channels differ.
Where possible for Known Stakeholders it is good practice to identify them, and their individual channel preferences in advance.
However it is also important to note that a number of jurisdictions (such as the EU, with the [[GDPR](#ref-gdpr)]) regulate the use of information about individuals
that includes communication channel information.
It is important to include channels that enable Anonymous Stakeholders to follow important developments.

Boradly, communication channels can be considered two-way, enabling communication with an individual Known Stakeholder or with all of them at once, or boradcast, providing a mechanism available to Anonymous Stakeholders to receive important information. Additionally, some mechanisms allow for persistent information, while others are only temporary; A website can be maintained long-term or the information can be removed, information sent by email can easily be retained by the recipient in perpetuity, while information in e.g. a Slack or Telegram channel could be deleted after a matter of days or weeks

It is also important, especially for services used for two-way communication with Known Stakeholders, to consider the security and privacy of the channels used.
While channels such as Telegram or Whatsapp use encryption, in the case of the former all communication is decoded at some unknnown centralized point, in the latter large amounts of metadata are available to the service provider.

While many messaging services can behave in either manner, some such as websites are well-suited to broadcast communication
while others are specifically suited to individual two-way communication.

Common communication tools that Stakeholders are likely to find familiar and actively use include Websites, email, message-based services such as Telegram, Discord, Slack, Signal, Whatsapp and "post"-oriented services such as X (the former Twitter), BlueSky, Facebook/Instagram, and the like.



### Stakeholder Management

#### General Procedures

The following procedures enable appropriate consideration and management of relevant stakeholders:

1. Define all stakeholders that are relevant to your organization
2. Define and align communciation channels that you intend to use for engagement with your stakeholders
3. Perform a stakeholder mapping and define your individual ways of engagement with the different stakeholder groups
4. Document all defined stakeholders with the respective management measures in the stakeholder register. Also take best practices covering incident communication into account.
5. Define appropriate intervals to review accuracy and relevance of documented contents in the stakeholder register

#### Stakeholder Map

The **Stakeholder Map** provides guidance when categorizing the individual stakeholders into different communication groups. It can be used as an initial assessment for further review and adaption to your individual stakeholder landscape.


Only use the Communication Map below as a reference! Review each your stakeholder individually and assess needed means of contact! You can find the template here: [stakeholder-map.md](../templates-and-toolkits/stakeholder-map.md "mention")


<figure><img src="../../.gitbook/assets/Stakeholder_Map (6).png" alt=""><figcaption><p>Stakeholder Map</p></figcaption></figure>

##### Manage Closely

* Establish direct communication channels (e.g., Telegram, Slack or similar)
* Individual status reporting and communications
* Perform immediate alignment in case of incidents

##### Keep Satisfied

* Establish public communication channels (e.g., Telegram, Discord, X)
* Regular status reporting and engagement
* Provide summary and updates in case of incidents

##### Keep Informed

* Establish direct or public communication channels depending on need for responsiveness (e.g., Mail, Discord, Telegram, Slack, X)
* Provide summary and updates in case of incidents

##### Monitor

* Monitor activities and react to activities and requests

#### Stakeholder Register

The **Stakeholder Register** is a key management document, listing all stakeholders with details about their roles, interests, and impact on the organization. It is essential for understanding and managing stakeholders, ensuring tailored and effective communication.


You can download the spreadsheet here: [https://docs.google.com/spreadsheets/d/1ovBZbYhR5c-l83F4KKgNKam8igAKPASS/edit?usp=sharing\&ouid=117284374075970906179\&rtpof=true\&sd=true](https://docs.google.com/spreadsheets/d/1ovBZbYhR5c-l83F4KKgNKam8igAKPASS/edit?usp=sharing\&ouid=117284374075970906179\&rtpof=true\&sd=true)



</section>

<section id="sec-references">

## References

#### [BSSC KMS]
"Key Management Standard version 1", J Kemp and M Nesbitt eds., Blockchain Standards Security Council 2025. [https://specs.blockchainssc.org/kms/v1/](https://specs.blockchainssc.org/kms/v1/)

<a id="ref-ccss"></a>
#### [CCSS]
"CCSS v9.0 Table", C4 2025. [https://cryptoconsortium.org/ccss-table-v9/](https://cryptoconsortium.org/ccss-table-v9/)

<a id="ref-csp"></a>
##### [CSP]
"Content Security Policy", Mozilla Corporation. [https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

<a id="ref-cors"></a>
##### [CORS]
"Cross-Origin Resource Sharing (CORS)", Mozilla Corporation. [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

<a id="ref-cve"></a>
##### [CVE]
"CVE", Mitre, 1995-. [https://www.cve.org](https://www.cve.org)

<a id="ref-iso-27001"></a>
##### [ISO 27001]
ISO IEC 27001:2022 "Information security, cybersecurity and privacy protection — Information security management systems — Requirements" 3rd Ed. ISO, 2022. [https://www.iso.org/standard/27001](https://www.iso.org/standard/27001)

<a id="ref-nist-800-115"></a>
##### [NIST-800-115]
"Technical Guide to Information Security Testing and Assessment", Karen Scarfone, Murugiah Souppaya, Amanda Cody, and Angela Orebaugh. NIST 2008. [https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

<a id="ref-owasp-access-control"></a>
##### [OWASP Access Control]
"OWASP Top 10: A01:2021 - Broken Access Control", OWASP 2021. [https://owasp.org/Top10/A01_2021-Broken_Access_Control/](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

<a id="ref-owasp-cryptographic-failures"></a>
##### [OWASP Cryptographic Failures]
"OWASP Top 10: A01:2021 - Cryptographic Failures", OWASP 2021. [https://owasp.org/Top10/A01_2021-Cryptographic_Failures/](https://owasp.org/Top10/A01_2021-Cryptographic_Failures/)

<a id="ref-owasp-ssrf"></a>
##### [OWASP SSRF]
"OWASP Top 10: A10:2021 - Server-Side Request Forgery (SSRF)", OWASP 2021. [https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)


<a id="ref-premortem"></a>
##### [Pre-mortem]
"How to Use Pre-mortems to Prevent Problems, Blunders, and Disasters", Shreyas Doshi, 2020. [https://medium.com/@shreyashere/how-to-use-pre-mortems-to-prevent-problems-blunders-and-disasters-6ecc6df6e22a](https://medium.com/@shreyashere/how-to-use-pre-mortems-to-prevent-problems-blunders-and-disasters-6ecc6df6e22a)

<a id="ref-rfc2119"></a>
### RFC2119
"Key words for use in RFCs to Indicate Requirement Levels", S. Bradner, IETF 1997.
[https://www.rfc-editor.org/rfc/rfc2119.html](https://www.rfc-editor.org/rfc/rfc2119.html)

<a id="ref-rfc8174"></a>
### RFC8174
"Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", B. Leiba, IETF 2017.
[https://www.rfc-editor.org/rfc/rfc8174.html](https://www.rfc-editor.org/rfc/rfc8174.html)

<a id="ref-sbom"></a>
##### [SBOM]
"Software Bill of Materials (SBOM)" CISA, 2024. [https://www.cisa.gov/sbom](https://www.cisa.gov/sbom)

<a id="ref-soc2"></a>
##### [SOC2]
"2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy (With Revised Points of Focus — 2022)" AICPA 2022. [https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) (requires AICPA membership)

More:

- [NIST SP 800-34 Template](https://csrc.nist.gov/files/pubs/sp/800/34/r1/upd1/final/docs/sp800-34-rev1_cp_template_high_impact_system.docx)
- [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final)

### Tools:

- Apache web-server [LimitRequestBody](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestbody), [LimitRequestFields](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestfields)
- [AWS WAF module](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html), [AWS IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html)
- [CIS benchmarks](https://www.cisecurity.org)
- [Cognito](https://aws.amazon.com/cognito/), [Cognito's Userpool Addons for auditing authentications](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html)
- [CoGuard](https://www.coguard.io)
- [docker-compose](https://docs.docker.com/compose/) [like executing as root user inside a Docker container](https://docs.docker.com/engine/reference/commandline/container_exec/))
- [DoppelBuster](https://github.com/SimplyStaking/DoppelBuster)
- [ELK stack](https://www.elastic.co/elastic-stack/)
- [Grafana](https://grafana.com), [alerting setup in Grafana.](https://grafana.com/docs/grafana/latest/alerting/set-up/)
- [Hibernate](https://hibernate.org/orm/documentation/getting-started/)
- [Keycloak](https://www.keycloak.org) [Impersonation mechanisms need to be audited (if it is enabled).](https://github.com/keycloak/keycloak/blob/main/docs/documentation/server_admin/topics/users/con-user-impersonation.adoc)
- [Kubernetes Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/)
- [Liquibase](https://www.liquibase.org)
- Microsoft IIS [Microsoft IIS (input limits) example](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/mimemap), [Webserver authentication configuration of Microsoft IIS servers.](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/authentication/)
- [minikube](https://minikube.sigs.k8s.io/docs/)
- [shred](https://man.archlinux.org/man/shred.1.en)
- [SQLAlchemy](https://www.sqlalchemy.org)
- [Trivy](https://github.com/aquasecurity/trivy)
- [TypeORM](https://typeorm.io)
- [vault SSH certificate mechanisms](https://developer.hashicorp.com/vault/docs/secrets/ssh/signed-ssh-certificates)
- <a id="tool-zabbix"></a>[Zabbix reference](https://www.zabbix.com/documentation/6.4/en/manual/appendix/items/activepassive?hl=CPU%2Cload)

</section>

<section id="sec-sotd">

## Status and Feedback

This document is an Editor's draft, for a proposed revision to the [DUCK Knowledge Base (version 1)](https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base).

Feedback is welcome, and is preferred as Issues, Pull requests and comments in this Github Repository. Please note the [Conditions of Contributing](./CONTRIBUTING.md).

### History and Future

The original content of this specification was developed as the D.U.C.K Knowledge Base, and the current work is a direct evolution of that content.

In updating it, there are several changes being made. The key change is to move from a general explanation of risks and good practices
to a specification that is well-suited to assessment of conformance.

Several somewhat cosmetic-seeming changes have been made. Most obviously, the name has been changed to ValOS - the Validator Operator Standard -
and instead of a multi-page website it is available primarily as a single-page specification, in particular enabling easier use offline.

The update process aims to meet some general goals:

- Simplify redundancy
- Use linking more effectively
- Respond to feedback from real-world use, to improve the utility of the specification
- Increase the transparency of and community participation in the maintenance of the specification

### Versions and Version Numbers

The approach to versions for this specification is to maintain a publicly visible "latest Editor's draft",
representing the current state of what has been proposed and agreed as updates for a new version, and release versions, numbered 1, 2, 3 etc.

The "Editor's Draft" version may change frequently, for example weekly.
It is primarily to serve the needs of the community involved or interested in the process of updating the specification.
Part of that community is practitioners such as Node Operators themselves, developers and service providers, and assessors,
who want to understand changes that they will need to make to their workflows in the short- to medium-term future.

We seek to provide transparency into proposed changes,
and the process by which they are agreed or rejected, as well as the history of changes that have been made.

The release versions are intended to provide stable reference points, primarily for clarity in understanding the meaning of a specific assessment against a specific version.

The timing of new release versions seeks to balance keeping up with current best practice, and providing a stable target for learning and implementing.
It is likely that a release cycle will be on the order of 6 to 18 months. The motivation for a new release can be the time elapsed since the last version,
a major change to best practices or risks, or a combination of these factors, among others.

</section>
