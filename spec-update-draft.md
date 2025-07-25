# ValOS

Copyright© 2025, Lido Foundation. This document may be used, modified, copied and distributed under the terms of the [Apache 2 License](./LICENSE).

## Editor's draft post version 1


<dl> Version 1: [https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base](https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base)

<dt>Contributors to this version:</dt>

<dd>This specification builds on the content developed as the DUCK Knowledge Base, and we gratefully acknowledge the contributions from everyone who developed that. In addition, specific contributions to this version have been made by:

Oriol, Miguel, Ivan Ang, Antonio Bartulovic, Albert Heinle, Sreepriya Kalarikka, CK Teo, Julian Ueding, Scott Waller, @dracaryspierce, Sven (This list is a work in progress. The editor apologises for any names that have been missed, and requests that you let us know so we can rectify that).
</dd>

<dt>Editor:</dt> <dd>Chaals Nevile</dd>
</dl>



## Abstract

This specification defines a series of risks that can apply when operating a blockchain node.
It provides a series of mitigations that can minimise the likelihood that particular risks will be realised and cause a problem,
such as compromising the control of a node or actions that result in reduced economic rewards, or penalties such as slashing.

## Table of Contents

- [Abstract](#abstract)
- [Introduction](#introduction)
- [Abstract](#abstract)
- [Risks](#risks)
  - [Slashing Risk](#slashing-risk)
  - [Downtime Risk](#downtime-risk)
  - [Validator Key Custody Risk](#validator-key-custody-risk)
  - [Withdrawal Key Custody Risk](#withdrawal-key-custody-risk)
  - [General Infrastructure Risk](#general-infrastructure-risk)
  - [Service Partner Specific Risk](#service-partner-specific-risk)
  - [Downtime Risks](#downtime-risks)
  - [Reputational Risk](#reputational-risk)
- [Risk Management Procedures](#risk-management-procedures)
  - [Risk Monitoring](#risk-monitoring)
  - [Incident Response Plan](#incident-response-plan)
  - [Disaster Recovery Plan](#disaster-recovery-plan)
  - [Pre-Mortem](#pre-mortem)
- [Risk Assessment Procedures](#risk-assessment-procedures)
  - [Financial Loss](#financial-loss)
  - [Occurrence Probability](#occurrence-probability)
  - [Risk Matrix](#risk-matrix)
- [Review and Audit Procedures](#review-and-audit-procedures)
- [Mitigation Strategies](#mitigation-strategies)
  - [Node-Operator Technology Stack Mitigations](#node-operator-technology-stack-mitigations)
  - [Secret Management](#secret-management)
  - [Access Management](#access-management)
  - [Development and Update Process](#development-and-update-process)
  - [Monitoring](#monitoring)
  - [General Measures](#general-measures)
- [Controls Catalog](#controls-catalog)
- [Communications Strategy](#sec-communications-strategy)
- [References](#sec-references)
- [Status and Feedback](#sec-sotd)


## Introduction

### Purpose

This specification builds on the DUCK knowledge base as an evolution. In addition to the risk framework, updated based on feedback from practitioners,
and an explanation of mitigation strategies that has likewise been updated, it provides a single set of controls - statements of requirement that can be tested,
to ensure that as far as possible a Node Operator is following the recognised best practices to minimise risk and effectively maximise their returns.

While there are other standards such as AICPA's SOC 2® [SOC2](#soc2) or ISO's 27001 standard [ISO27001](#iso27001) that can be applied to Node Operators,
they often include more general requirements than this specification, reflecting a broader scope.

The relevant controls from several such standards are explicitly linked to the controls in this specification. The purpose of this is twofold:
to simplify the process of certifying conformance to this specification for Operators who have already undergone testing against those standards,
and to simplify the process of assessing against those standards Node Operators who have been certified as conforming to this specification.

## Risks

The six core risk categories specific to node operations define overarching
dimensions that Node Operators should consider in their overall setup.


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
  <td>Validator shuts (temporary) down. System spins up a new validator with the same key</td>
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
  <td><br>New versions of a validator client may cause errors that lead to slashing</td>
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
  <td>A Ex-Employee can still have access to the system when his acces is not blocked or removed</td>
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
  <td>Malicious External Hacker can get access through by-passing or brut-forcing authentication systems</td>
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
  <td>Slashing events keep ongoing on because no slashing monitoring system in place</td>
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

### Validator Key Custody Risk

Losing access to critical system components.

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

### Withdrawal Key Custody Risk


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
  <td>No container/node should be openly accessible from the internet from all IP addresses. This increases the attack vector enormously</td>
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
  <td id="risk-sps-1">SPS1</td>
  <td>Process</td>
  <td>Exit Risk - Deliguent state</td>
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
  <td>Reputation damage due to mismanagement slashing, downtime or access loss to keys</td>
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


## Risk Assessment Procedures

This Risk Assessment Procedure provides a systematic approach for Ethereum
node operators to assess the financial loss and the probability for each
identified scenario.

### Financial Loss

First, it is important to assess the likely financial loss for any given risk scenario.

#### Direct Monetary Losses from a Slashing Event
Assess the losses directly linked to the slashing event. This can include:

* Direct slashing penalty due to double signing (currently 1 ETH)
* "Correlated slashing penalty" occurs 18 days after the initial slashing
* Slashing leads to validator downtime until the slashed validator is exited
* Missed rewards
* Possible recoveries from insurance payments




#### Direct Monetary Losses from a Downtime Event
Assess the losses directly from the downtime event. This can include:

* Downtime penalties until the validator is exited
* Missed rewards
* Possible recoveries from insurance payments

#### Reputational Risks
Determine the monetary loss from reputational damage. This includes:

* Reduction in earnings due to the depletion of presently staked assets
* Loss of anticipated earnings due to the diminishment of future staked assets

#### Losses from the Event Investigation
Indirect losses can arise from the investigation of the slashing or downtime event. This can include:

* Costs associated with conducting an internal investigation
* Expenses for external investigative services
* Replacement or upgrading of hardware and software

#### Legal Disputes and Liabilities
Additional costs can come from legal disputes and liabilities. This can include:

* Obligation for slashing or downtime events as stated in Service Level Agreements
* Expenses for legal dispute settlement and court fees to address or defend against liabilities
* Costs associated with legal consultation and advisory services
* Possible insurance payments (e.g. for legal defence costs)



### Occurrence Probability

Assign a likelihood of occurrence and estimate the potential financial impact for each risk identified. This approach considers the specific operational context of the node operator and requires the node operator to tailor the assessment to its unique risk exposure, and vulnerabilities and to take the mitigation strategies into account. This process can be informed by:

* Analyzing historical data to understand past trends and incidents (external, internal incidents, and near-miss incidents)
* Reviewing industry reports for insights into common risks and their fiscal consequences in similar scenarios
* Consulting with experts in the field to gain a comprehensive perspective on risk probabilities and impacts
* Utilizing risk assessment tools or software for a more data-driven analysis
* Analyze the Mean Time to Repair (MTTR, The average time it takes to fully restore a system or service after a failure or security incident) in case of a downtime under different scenarios.



### Risk Matrix

Create a risk matrix to visually categorize risks based on their severity and likelihood. This helps in prioritizing which risks need more immediate attention. This process can be performed before and after the identified mitigation and controls are in place to visualize the effect of these strategies.

## Review and Audit Procedures

### Introduction

This document provides a guide for Ethereum node operators on the best practices for conducting IT security-related reviews and audits. It aims to ensure the security, efficiency, and compliance of the node operations within the Ethereum network.

See also the NIST Technical Guide to Information Security Testing and Assessment [NIST-800-115](#ref-nist-800-115).

#### Internal Reviews vs External Audits

##### Internal Reviews:

* **Purpose:** To conduct self-assessments of the node's operation and management
* **Process:** Conducted by the node's operating team using internal checklists and monitoring tools
* **Benefits:** Quick identification and rectification of operational issues and continuous improvement at a low cost

##### External Audits:

* **Purpose:** To provide an independent assessment of the node's operation and compliance
* **Process:** Conducted by third-party experts or audit firms specializing in blockchain technology and IT security
* **Benefits:** Provides credibility, helps in identifying blind spots in internal reviews, and ensures compliance with industry standards

### Types of Audit

#### Infrastructure Audits:

* **Purpose:** To identify vulnerabilities, ensure alignment with best practices, and ensure that the node is secure from internal and external threats
* **Key Areas:** Examples are network access points security, patching, set-up of the failover system, back-up, access management, slashing protection, key management and data encryption

#### Smart Contract Security Audits:

* **Purpose:** To identify vulnerabilities in the smart contracts developed by the node operator
* **Key Areas:** Examples are Smart Contract security audit or deployment audit

#### Compliance Audits:

* **Purpose:** To verify adherence to regulatory requirements and Ethereum network standards
* **Key Areas:** Validate node's alignment with Ethereum's protocol updates and adherence to legal regulations concerning cryptocurrency operations (e.g. OFAC MEV compliance and KYC compliance)

#### Performance Audits:

* **Purpose:** To assess the efficiency and stability of the node
* **Key Areas:** Block propagation time, transaction processing speed, uptime metrics, and resource utilization (such as CPU and memory usage)

### When to Perform Audits

#### Regularly-Scheduled Audits:

* **Frequency:** Conducting audits regularly ensures consistent security. Regular audits are required as security standards change over time and new vulnerabilities and attack vectors are published.
* **Scope:** These audits should encompass all types of audits mentioned under section 2.

#### Event-Triggered Audits:

* **Triggers:** Perform audits in response to specific events such as network upgrades (hard forks), security breaches, updates of the smart contract, compliance events,  performance issues, or major infrastructure updates.
* **Focus:** These audits should primarily assess the impact of the event on your node's operation and security.

### General Suggestions for Internal Audit

#### Responsible Person:

* Assign a dedicated team or individual responsible for conducting and overseeing the audit process.
* This role includes planning, executing, and following up on audit findings.

#### Well-defined Checklist:

* **Internal Audit Checklist:** Develop a comprehensive list covering all aspects of node operation, including security, performance, and compliance. This checklist should be regularly updated to reflect changes in technology and regulations. This checklist should be created with input from the internal team and, if possible, checklists from external sources.
* **External Audit Checklist:** For external audits, prepare a list that includes areas for external verification.

#### Documentation Approach:

* Establish a systematic approach for documenting the audit process.
* This should include the responsible person, types and dates of audits having been conducted, audit reports, methods used conducting the audit, scope of the audit and audit vendor.

#### Documentation of Results:

* Create a structured format for reporting audit results.
* This should include detailed findings, recommendations, and any corrective actions taken.
* Ensure that these reports are accessible to relevant stakeholders for review and follow-up.

## Mitigation Strategies

The Mitigation Strategiers section serves as a go-to resource for node operators, providing actionable insights and mitigation options to enhance the security, reliability, and efficiency of their operations.

Most of the best practices that optimize up-time, access control and general stability directly apply to operating a node properly. However, there are a few risks that are very specific to running a node-operator, and to mitigate them, higher levels of process segregation need to be achieved.


### Node-Operator Technology Stack Mitigations

#### Local anti-slashing database


To avoid double signing, validators maintain a history of messages they signed, and this is usually stored inside of a database. In some cases, this feature is enabled by an external web3signer. The maintenance and protection of this database is crucial, as inconsistencies in this database may cause a double-signing event. The following items need to be in place:

* Persistence of anti-slashing database: Ensure that a persistent, not a temporary storage is used for the anti-slashing database.
* Ensure that slashing databases are always connected: It is possible to run a validator and a database, but never connect those two. Verify via monitoring that they interact.
* Prevent deletion

<div class="info">

##### A Local anti-slashing database helps address the following risks

* [SLS1](#risk-sls-1)
* [SLS2](#risk-sls-2)
* [SLS3](#risk-sls-3)
</div>

#### Doppelgänger protection

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

* [SLS2](#risk-sls-2)
* [SLS3](#risk-sls-3)
* [SLS14](#risk-sls-14)
* [SLS15](#risk-sls-15)
* [KEC5](#risk-kec-5)
* [KEC6](#risk-kec-6)
</div>

#### Client diversity

Maintain a diverse set of clients for different protocols, in order to reduce blast radius in case one of the clients appears to have a protocol error or other bug. In some cases, migrate keys to different clients in case of a specific client error observed, such as startup issues after controlled update or bug in the latest version of the chosen client.

<div class="info">

##### Client diversity helps address the following risks

* [SLS6](#risk-sls-6)
* [SLS7](#risk-sls-7)
* [DOW2](#risk-dow-2)
* [DOW19](#risk-dow-19)
</div>

#### Distributed Validator Technology (DVT)

In order to avoid the single-point of failure problem for a node-validator without risking a slashing incident, DVT has been developed.

<div class="info">

##### DVT helps address the following risks

* [SLS1](#risk-sls-1)
* [SLS14](#risk-sls-14)
* [SLS15](#risk-sls-15)
* [KEC2](#risk-kec-2)
* [KEC3](#risk-kec-3)
* [KEC4](#risk-kec-4)
* [KEC5](#risk-kec-5)
* [KEC6](#risk-kec-6)
</div>

#### Lido-specific: Handling of delinquent state

In order to avoid loosing out on opportunity cost, Node operators need to develop and adhere to strict processes to properly exit validators, as they are otherwise put into a delinquent state. This results in monetary losses.

<div class="info">

##### Handling delinquent state helps address the following risks

* [SPS1](#risk-sps-1)
</div>

### Secret Management

#### Controlled/audited secret access

Any secret, including access credentials for internal systems needs to be accessed and authorized through a vault system. In this way, everything is audited, and anomaly detection can be activated for those vaults. Using multi-sig wallets, requiring authorization from multiple parties for specific actions, helps to ensure both that relevant access is monitored and that it is correctly controlled.

<div class="info">

#### Secret access management helps address the following risks

* [SLS5](#risk-sls-5)
* [KEC1](#risk-kec-1)
* [KEC3](#risk-kec-2)
* [KEC2](#risk-kec-3)
* [KEC4](#risk-kec-4)
* [KEC6](#risk-kec-6)
* [KEC8](#risk-kec-8)
* [KEC9](#risk-kec-9)
* [KEC10](#risk-kec-10)
* [KEC11](#risk-kec-11)
* [GIR25](#risk-gir-25)
</div>

#### Encryption of data at rest/in transit

Many different components interplay while a staking operation is going on. It is crucial, since sensitive information may be transmitted, to ensure that data is stored and transmitted in an encrypted fashion.

<div class="info">

#### Data encryption helps address the following risks

* [SLS8](#risk-sls-8)
* [KEC5](#risk-kec-5)
* [KEC6](#risk-kec-6)
* [KEC7](#risk-kec-7)
* [KEC10](#risk-kec-10)
* [KEC11](#risk-kec-11)
* [GIR10](#risk-GIR-10)
</div>

#### Cold Storage

Cold Storage, in particular "air-gapped" storage, can help protect information not used often such as withdrawal keys, private key generation materials, and the like.

<div class="info">

#### Cold storage helps address the following risks

* [KEC5](#risk-kec-5)
* [KEC6](#risk-kec-6)
* [KEC7](#risk-kec-7)
</div>

#### Signing key management

It is important to protect signing keys from accidental or malicious misuse, and in particular deletion.
It is not normal to provide broad acceess to unencrypted signing keys.

Best practices include ensuring that there are no single individuals with the capability to access or delete them, and having backups.
Modern vault systems enable the enforcement of policies to ensure that access to keys is only available with verified roles, and deletion is managed according to established protocols.

<div class="info">

##### Signing key management helps address the following risks

* [KEC2](#risk-kec-2)
* [KEC10](#risk-kec-10)
* [KEC11](#risk-kec-11)
</div>

#### Key rotation

Key rotation following a proper process help protect infrastructure from a potential misuse of credentials.

Best practise includes "When in doubt, rotate". Keys to rotate include, but are not limited to:

* The Postgres database used by Web3Signer
* The vault itself
* Any SSH keys
* Any API keys for your cloud infrastructure

<div class="info">

##### Key rotation helps address the following risks

* [SLS8](#risk-sls-8)
* [GIR6](#risk-gir-6)
* [GIR7](#risk-gir-7)
</div>


### Access controls & access management

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
2. Restrict Logical Access — Logical access to information assets, should be restricted through the use of access control software and rule sets.
3. Use sufficiently strong authentication systems.
4. Network Segmentation — Restrict access to nodes to a minimum set of IPs.
5. Manage Points of Access — Access to nodes inside the segmented area need to be controlled with authentication and authorization methods.
6. Proper credentials management for infrastructure software — A clear definition of each credential life-time is established and enforced.

COSO principle
//Does this belong in secret maangement?
7. Protects Encryption Keys — Processes are in place to protect encryption keys for their lifetime.

This is covered by [secret management](#secret-management)

Special considerations:

* Disable meta-data serving through public endpoints (like what server is running in what version).
* Limit the outbound traffic of a node that runs a certain service.
* Apply rate limits to ensure that internal services cannot unintentionally DDos each other.
* Where possible apply the use of authentication tokens that have a limited lifetime.



**Examples for best practices:**

* Creation and continuous analysis of Software Bill of Materials [SBOM](#ref-sbom).
* Use of Clients, roles and groups when using [AWS IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html).
* Have an internal virtual private network and only have well-defined endpoints be accessible from the web.

<div class="info">

#### Access Control helps address the following risks

* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
* [DOW7](#risk-dow-7)
* [DOW16](#risk-dow-16)
* [GIR1](#risk-gir-1)
* [GIR7](#risk-gir-7)
* [GIR9](#risk-gir-9)
* [GIR22](#risk-gir-22)
* [KEC4](#risk-kec-4)

#### External Controls For Access Management

* [OWASP A01:2022: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
* [ISO27001](#iso27001) Annex A 5.15
* [SOC2](#soc2) Trust services Criteria CC 6.1

</div>

### Implement least privilege

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

* Disable privilege escalation mechanisms ([like executing as root user inside a Docker container](https://docs.docker.com/engine/reference/commandline/container_exec/))
* [Impersonation mechanisms need to be audited (if it is enabled).](https://github.com/keycloak/keycloak/blob/main/docs/documentation/server_admin/topics/users/con-user-impersonation.adoc)* Credentials rotation needs to be in place to ensure that there is no interruption in the service when it is done.
* Off-boarding of a terminated employee should not take more than an hour. Ideally, one would only disable them inside a single-sign-on service such as [Cognito](https://aws.amazon.com/cognito/) or [Keycloak](https://www.keycloak.org).
* Tools need to be in place to analyze the permissions of certain users/programs and determine if these are too wide.
* Use of roles on the API endpoint level to determine the correct authorization.
* [Webserver authentication configuration of Microsoft IIS servers.](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/authentication/) Observe how different authentication methods are possible to be set there. `anonymousAuthentication` would allow anyone to access as `anonymous`, which is rarely the intention except for the starting page. `basicAuthentication` is better than nothing, but makes user management not scalable. `clientCertificateMappingAuthentication` and `digestAuthentication` are the better ways to also implement RBAC.

Even when employing RBAC, there are ways to log into containers as users and acquire larger privileges from there. Take `docker exec -uroot` as an example. These mechanisms can be disabled on the orchestration level (and should be).

<div class="info">

#### Least Privilege helps address the following risks

* [KEC11](#risk-kec-11)
* [GIR1](#risk-gir-1)
* [KEC8](#risk-kec-8)
* [GIR25](#risk-gir-25)
* [GIR1](#risk-gir-1)
* [GIR5](#risk-gir-5)
* [GIR7](#risk-gir-7)
* [GIR9](#risk-gir-9)
* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
* [DOW16](#risk-dow-16)
* [GIR1](#risk-gir-1)
* [GIR22](#risk-gir-22)
* [KEC8](#risk-kec-8)
* [GIR25](#risk-gir-25)

#### External Controls for Least Privilege

* [OWASP A01:2022: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
* [SOC2](#soc2) Trust services Criteria CC 6.3
* [ISO 27001](#iso-27001) Annex A 8.2

</div>


### Strict employment termination process in place

Ensure that employees whose roles have changed do not have lingering credentials they can use or others can misuse to cause harm.

<div class="info">

#### @@ helps address the following risks

* [SLS10](#risk-sls-10)
* [DOW17](#risk-dow-17)
* [GIR25](#risk-gir-25)
</div>

### Network access to nodes

Following the principles of defense in depth and [**least privilege**](#def-least-privilege), it is important that nodes are not directly accessible without permission, and that they do not leak information to the Web that can help malicious parties gain unauthorized access.

Best practice includes restricting Web Access through a load-balancer that has a firewall, and ensuring any remote access capability is clearly justified.

As well as controlling physical access where possible, it is best practice to ensure that nodes are only responsive through restricted access networks. Further, it is important to ensure the hardware running nodes does not have extraneous software (that can increase the risk of monitoring), does not allow generic probing mechanisms such as open port scans that can help malicious parties learn the topology of target systems,   

<div class="info">

#### @@ helps address the following risks

* [SLS12](#risk-sls-12)
</div>

### Strong authentication

Use password policies to ensure that access control mechanisms are sufficiently strong at every layer of the infrastructure (i.e. DUCK123 should never be an allowed password ;-)). When users are authenticating, MFA should be used.

<div class="info">

#### @@ helps address the following risks

* [SLS13](#risk-sls-13)
</div>

### Prevent Unauthorized Physical Access

This covers all physical devices that can access the Node, as well as all areas in which such devices are kept, whether "on-premises", distributed, hosted by a third party, or remote mobile devices such as laptops.

* Manage and monitor entry to physical areas and physical access to assets.

Best practice for managing physical access includes ensuring that authorization is granted as necessary, following the principles of [Least Privilege](#def-least-privilege), meaning that some devices are physically segregated in areas where access is determined according to their function. Note that this covers the use of devices authorized to access the networks nodes operate on, and is particularly important for devices authorized to access management and analytical functions of nodes.

Ideally all physical access to premises and facilities is monitored, particularly to deter, and determine whether the facility is subject to, <dfn>piggybacking</dfn>, where an unauthorized entrant is allowed in by someone who has a valid authorization for themselves. However, in the context of remote operators' access through a computer this is particularly challenging in practice.

Piggybacking may occur inadvertently, through politely holding a door for someone without checking that they have current valid authorization to enter, negligently by allowing someone to enter for a legitimate purpose despite that person not having a valid authorization, or maliciously allowing someone to enter knowing that their purpose is nefarious.

In the inadvertent case, relevant mitigations include
- ensuring that all those with authorization understand the necessity to enforce physical access control,
- providing simple and effective ways to check authorization,
- ensuring that remote access devices as far as possible are dedicated to the defined purposes (rather than allowing the use of general-purpose laptops that could be attacked when being used for a different task such as general email, or playing games).

To minimize negligently allowed access, it is important to ensure that access systems are effectively maintained and managed to ensure there is no good reason to allow an unauthorized person access. This can range from the design of onboarding systems to the effectiveness of internal management feedback systems for discovering unanticipated problems faced by operators.

Best practice is to ensure that physical access is managed by systems that can efficiently enable access to authorised parties (keycards, biometric scanners) and monitor actual access such as visual verification that the authorized party is the one entering.

It is important to log and audit access sufficiently frequently to detect problems - see also [Monitoring](@@).

### Protect Against Environmental Threats

Physical devices are subject to physical changes, including environmental issues such as temperature extremes that can cause damage,
and utility failures such as power or internet failure.

Mitigation strategies include the use of redundant infrastructure with failure detection and failover systems,
from backup node servers in different geographical locations to backup power supply e.g. through local batteries or power generation.
The level of mitigation that is appropriate depends on the level of risk, and the costs of both failure and mitigating failure.
These calculations mean economies of scale will enable larger-scale operations to be more robust than smaller ones, for a given price.

It is also important to ensure that facilities have appropriate protection from relevant environmental risks such as fire, flooding, or extreme wind,
and destructive physical attacks. Appropriate mitigations will depend in part on the specific location and nature of the facility.

<div class="info">

#### Relevant External Controls for Environmental Threats

* [ISO 27001](#iso-27001) Annex A 7
The lifecycle of equipment, most particularly node servers and computers used to access and manage them, is a determinant of overall security.

#### Environmental Threats helps address the following risks

* SLS 14,15
* [DOW1](#risk-dow-1), [DOW5](#risk-dow-5), 7-9
</div>

[Monitoring](#@@) can also identify specific conditions that adversely affect equipment and suggest that a lifecycle plan needs adjustment - whether writing off equipment destroyed by fire, or increasing preventive maintenance for physical access systems that are being used far in excess of expectations that drove the existing maintenance plan.

### Manage Equipment Life-cycle.

The lifecycle of equipment, most particularly node servers and computers used to access and manage them, is a determinant of overall security.

Best practices for lifecycle management include the ability to remotely pause, shut down, and wipe devices clean, although this needs to be considered in the context of the risk of malicious access to those capabilities.

[Monitoring](#sec-monitoring) can also identify specific conditions that adversely affect equipment and suggest that a lifecycle plan needs adjustment - whether writing off equipment destroyed by fire, or increasing preventive maintenance for physical access systems that are being used far in excess of expectations that drove the existing maintenance plan.

<div class="info">

#### Relevant External Controls for Equipment Life-cycle

* [ISO 27001](#iso-27001) Annex A 7

#### Equipment Life-cycle helps address the following risks

* [DOW3](#risk-dow-3)
* KEC 1,5,[KEC6](#risk-kec-6), [KEC8](#risk-kec-8)
</div>

### Development and Update Process


#### Testing and review of all changes to infrastructure code


Anything on the infrastructure should be captured in a code repository, and changes managed through a versioning system such as Git. No direct push to the main branch should be possible; everything should go through pull requests and review.

All code should go through static and dynamic analysis tools to minimize risk.

There should be custom tests created, and a strict testing policy before pushing to prod needs to be in place.

Ideally, metrics should be used to verify a high degree of testing culture. This includes, but is not limited to:

* Line coverage
* Endpoint coverage
* Accidental human error detection
* Architectural enforcement

<div class="info">

#### Testing and code review helps address the following risks

* [SLS4](#risk-sls-4)
* [SLS5](#risk-sls-5)
* [SLS6](#risk-sls-6)
* [SLS7](#risk-sls-7)
* [SLS18](#risk-sls-18)
* [DOW2](#risk-dow-2)
* [DOW6](#risk-dow-6)
* [DOW11](#risk-dow-11)-[DOW14](#risk-dow-14)
* [GIR11](#risk-gir-11)
* [GIR13](#risk-gir-13)
* [GIR18](#risk-gir-18)
* [GIR21](#risk-gir-21)
* [GIR23](#risk-gir-23)-GIR24
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
</div>

#### No custom changes to the validator software

Validator software is open source, but in order to ensure that no protocol error occurs, the code should not be touched.

<div class="info">

##### Not customising third-party software helps address the following risks

* [SLS7](#risk-sls-7)
* [DOW13](#risk-dow-13)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
</div>

#### Sanitize inputs

Unchecked inputs are a major cause for overflow attacks and brute force. Ideally, the load balancer in front of the node filters out all traffic that has too large headers and payloads. Additionally, if JSON payloads are being used, they should be checked to adhere to a certain schema.

<div class="info">

##### Input checking helps address the following risks

* [GIR8](#risk-gir-8)
</div>

#### Use of separate tests and staging environments

This minimizes a potential blast radius. It is important to run any change (even an update of a validator software or Web3Signer) through a test environment first, and then roll it out in a staged fashion. If it causes some slashing event, it is then contained to the few nodes that it was rolled out to.

<div class="info">

#### Test and staging environments help address the following risks

* [GIR11](#risk-gir-11)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
</div>

#### Use containerized and orchestrated environments only.

Follow their best practice recommendations. Their mechanisms are more than battle-tested in different environments. Any make-shift approach to do mechanisms such as fail-over by hand should be deemed insecure.

<div class="info">

#### Containerized environments help address the following risks

* [GIR23](#risk-gir-23)
</div>

#### Automation where possible

Human error is a real threat, and every process should at least follow an automated script that may or not be invoked by a human. The other risk of non-manual steps is the reduction of the risk of exposure of secrets. Everything should be done through pipelines and job-mechanisms (GitHub Actions, Apache Airflow, Apache Nifi)

<div class="info">

##### Automation helps address the following risks

* [GIR16](#risk-gir-16)
* [GIR18](#risk-gir-18)
* [GIR19](#risk-gir-19)
* [GIR20](#risk-gir-20)
* [GIR21](#risk-gir-21)
* [SLS17](#risk-sls-17)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
* [GIR25](#risk-gir-25)
</div>

#### Minimize CVEs in images

Analyzing images for potential CVEs is simple nowadays (use e.g. [Trivy](https://github.com/aquasecurity/trivy)). Further configurations inside these images can be checked using [CoGuard](https://www.coguard.io). Any image used in your infrastructure should be checked this way.

<div class="info">

#### @@ helps address the following risks

* [GIR17](#risk-gir-17)
</div>

### Monitoring and Alerting

Monitoring dashboards are an important tool to identify risks and gain relevant data.
This is one reason that a requirement for monitoring is present in almost all compliance and security frameworks.

It is crucial to monitor not only high level business functions but all containers.
In particular, proper log collection makes it possible to dynamically verify low-level requirements,
e.g. a slashing database is actually being used, and used by the right signer.

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


#### Logging/Alerting at all levels of the infrastructure

Every component of your node operation is producing logs. These should be captured, analyzed, and alert systems should be set up to warn if something is wrong. Examples include, but are not limited to:

* Web3Signer database has no CRUD operations going on (is it connected?)
* CPU/Memory spike suddenly in container
* Network traffic in and out of container
* Relays
* Slashing related logs on validator nodes

The alert systems should be automatically set up to take actions such as shutting nodes down (nuking).

<div class="info">

Take a look at [collection-of-tools-scripts-and-templates.md](../mitigation-and-controls-library/collection-of-tools-scripts-and-templates.md) for tool examples to perform the monitoring of some of the metrics mentioned above, as well as:

* Cognito's [Userpool Addons for auditing authentications](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html).
* Filtering and anaysis of anomalies can be done in AWS using the [WAF module](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html).
* An example for monitoring software is the [ELK stack](https://www.elastic.co/elastic-stack/).
* A very common centralized dashboard is [Grafana](https://grafana.com) - an example of [alerting setup in Grafana.](https://grafana.com/docs/grafana/latest/alerting/set-up/)

</div>


<div class="info">

#### Monitoring can help address the following risks:

* [SLS8](#risk-sls-8)
* [SLS16](#risk-sls-16)
* [DOW6](#risk-dow-6)
* [DOW15](#risk-dow-15)
* [GIR4](#risk-gir-4)
* [GIR13](#risk-gir-13)

#### Equivalent External Controls

* [SOC2](#soc2) Trust Services Criteria CC 7.2
* [ISO 27001](#iso-27001) Annex A 8.16

</div>

### General Measures

* General cyber security (Firewall, Intrusion Detection System, ....)
* Check the uptime promise of cloud provider (minimum three 9s)
* Failover system (also in different locations)
* Keeping track of age and replacing appliances //currently in access control and monitoring
* Conduct an internal special study of failover and load balancer strategies
* Being informed about the relevant natural catastrophes
* Ensure stable Internet connection of the System (Cloud, Bare Metal, ....)
* Ensure stable Power connection of the System (Cloud, Bare Metal, ....)
* Ensure proper load-balancer and firewall at the front
* Only necessary software on the relevant servers
* Being able to switch the relayer or disconnect from the relay
* Back-Up/DR / BC Policies
* Validate cloud, data center or infrastructure provider regarding security
* Safety training
* Central & accessible documentation of critical knowledge
* Having a communication toolkit and process prepared

### Incident Response

Incident Response Plans document procedures for managing security incidents and events,
as guidance for employees or incident responders who believe they have discovered, or are responding to, a security incident.
A well-documented Incident Response Plan helps employees in a high-stress situation by providing a reminder of all important actions and considerations.
To be useful, it is necessary that relevant employees know the plans exist, and how to find them.


Best practices for Incident response plans include

- Well-defined decision-making responsibilities.
- Where possible, automating responses
- Identify relevant participants in advance. Redundancy against specific failures such as a key employee being unavailable is important.
- Clear information about how to investigate and triage incidents,
  including when to notify and involve particular participants and how to escalate issues to the most appropriate person or team.
- Defined procedures to follow, for specific sets of circumstances
- Data collection and distribution to enable effective response, external communication, and "Post Mortem" analysis
- Well-defined communication strategies, for both internal and external communications.

#### Identify and respond to security incidents

Main outline from the COSO principles:

* Assigns Roles and Responsibilities in case of a security event.
* Contains Security Incidents — Ideally incidents can be contained within a short period of time.
* Communication protocols are in place to inform affected parties.
* Identified vulnerabilities need to be identified.
* Evaluate the identification and response on a regular basis.

**References:**

* CC 7.4 of the SOC 2 Trust services criteria

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

#### Analyze security events and learn from them

Main outline from the COSO principles:

* Have a proper incident response plan in place, and review it periodically.
* Communicates and Reviews Detected Security Events — Either take direct actions, or create tickets for future detection of events of a similar kind.
* Develops and Implements Procedures to Analyze Security Incidents.


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

##### External Controls for Disaster Recovery

* [SOC2](#soc2) CC 7.5

##### Disaster Recovery Plans help address the following risks:

* [GIR19](#risk-gir-19)

</div>

#### Pre-Mortem

Regular simulations of implementing an Incident Response Plan ensure that relevant personnel are familiar with them and can follow them when necessary.
"Pre-Mortems", simulating or "war-gaming" a specific failure, not only ensures people are familiar with the procedures to follow for specific risks,
and that those procedures are tested to give some idea of whether they are appropriate and adequate,
but often motivate people to think about other risks, and whether appropriate procedures and mitigations are in place.
Example topics for a Pre-Mortem could include

* Unauthorized users gain access to the servers
* A complex security compromise, where details are not immediately available
* A specific scenario results in downtime

Articles such as [Premortem](#ref-premortem)
offer further information on how to plan and implement simulations and how to derive the maximum benefit from them.

#### Post-Mortem

If any incident occurs necessitating an incident response, it is valuable to analyze the response, to identify possible improvements to existing plans,
as well as new unit tests and similar procedures that will help mitigate or prevent future incidents.

##### External Controls for Incident Post-Mortems

* [SOC2](#soc2) CC 7.3

##### Incident Post-Mortems help address the following risks:

#### Incident Communication

As well as direct financial losses, security incidents and disaster can also result in significant reputational damage.
Appropriate communication with stakeholders can significantly mitigate this risk.

It is important to note that inappropriate communication during an incident can increase the damage. External communication needs to balance
stakeholders' desire for information that provides them security or the ability to respond in a well-informed manner against
the importance of providing information that is fairly clear and certain, and will not later be contradicted.

Best practice for external communication about an incident includes providing a detailed post-incident summary.

## Controls Catalog

This section contains controls that are material to Node Operator risks.
Some of these control criteria correspond to similar controls from at least three common frameworks.

* [OWASP Top 10](https://owasp.org/www-project-top-ten/)
* [ISO 27001](#iso-27001)
* [SOC2](#soc2)

Where relevant, corresponding controls from those frameworks are identified and linked from ValOS controls.

### Controls for Access Control

@@ link to relevant mitigation(s)


#### Authentication required for services

All requests for services MUST require appropriate authentication

For example, a Node does not respond to anonymous requests on any port.

#### Access to Nodes limited by Network

Nodes MUST NOT respond to requests from outside a defined network.

#### Access to physical hardware is limited

Entry to physical server locations MUST require authorization

For example, a biometric scan or the use of a keycard.

#### Regularly Review Access Rights Management

A review of Access Rights MUST take place regularly

This covers both the processes and tools for granting and revoking access rights, and verifying that they are effectively managing access rights
according to the relevant principles ([**Least Privilege**](#def-least-privilege), [**Role-based management**](#@@)).
Best practice for this review includes:

- analyzing access logs for physical access to hardware, and ensuring authorized individuals are not given access to hardware
- verifying access to signing keys is limited to individuals whose roles mean they need it, and that all who need that access have it
- ensuring that processes are effectively followed and meet the Node Operator's business needs

##### Relevant Risks

* SLS 8-13
* DOW 16-18
* KEC 3,4,6-8, 10-11
* GIR 1,5,7

##### Relevant external controls

* [ISO 27001](#iso-27001) Annex A 5.18

#### Protect Data in Transit

All data in transit MUST be encrypted, and SHOULD use the most direct transmission available.

This covers all services that communicate data, such as Databases, Web servers, Load balancers, Authentication systems, CI/CD pipeline tools, etc.
Best practices include ensuring that the latest version of TLS is being used, with secure algorithms.

##### Relevant Risks

* [SLS11](#risk-sls-11), [SLS12](#risk-sls-12), [SLS13](#risk-sls-13)
* [DOW18](#risk-dow-18)
* [GIR10](#risk-gir-10)
* KEC 1-11

##### References

* [SOC2](#soc2) Trust services Criteria CC 6.7

COSO principles:
* Transmission of sensitive data needs to be restricted.
* Data in transit needs to be encrypted.

<section id="con-auto-monitoring">

### Controls for Automated Monitoring

Risks that Automated Monitoring can help mitigate:

* [DOW1](#risk-dow-1)

#### Log privileged access

Any operation that requires privileged access is logged. Any assignment of a key, or assignment of a role to or removal of a role from a particular key, MUST be logged.

#### Log personnel changes

Every change in the status of people who have access to any function of the Node, or physical access to any hardware, MUST be logged.

#### Log slashing events

Any event that results in slashing MUST be logged. There SHOULD be a procedure in place to determine whether there are repeating patterns,
that identify a failure (e.g. software bugs, operating procedures) which can be rectified.

#### Monitor hardware and network performance

Logs MUST provide a sufficiently detailed view of hardware and network performance to enable upgrade needs to be forecast,
and to alert if validators are operating with excess latency. Tools such as [Zabbix](tool-zabbix) can also display a live feed of CPU and memory usage of each compute instance.

#### Relevant external controls for Automated Monitoring

- [SOC2](#soc2) A 1.1
- [ISO 27001](#iso-27001) Annex A 8.21

</section>

### Controls for Environmental Threat Management

#### Manage Environmental Threats

Node Operators SHOULD have processes in place to manage environmental threats

This includes monitoring for such threats and physically hardened facilities (e.g. fire- and flood-resistant server rooms),
and physically decentralized infrastructure. It can also incorporate the use of DVT or related approaches to managing physical decentralization.

##### Relevant External Controls for Environmental Threats

* [ISO 27001](#iso-27001) Annex A 7

##### Environmental Threats helps address the following risks

* SLS 14,15
* [DOW1](#risk-dow-1), [DOW5](#risk-dow-5), 7-9

#### Manage Equipment Lifecycles

Node Operators SHOULD have processes in place to manage equipment lifecycles

This includes monitoring performance and performing preventive maintenance, upgrades, or replacing equipment as appropriate,
as well as processes that ensure equipment is correctly retired including removing data and any hardware-based authorization.

##### Relevant External Controls for Equipment Lifecycles

* [ISO 27001](#iso-27001) Annex A 7

##### Managing Equipment Lifecycles helps address the following risks

@@@@

## Summary of external controls

The following external controls correspond to controls defined in this specification.

**NB: The following items are being consolidated into the Controls Section, above [Ed.]**

<table><thead>
<tr><th width="443">Framework</th><th>Criterion</th></tr></thead><tbody>
<tr>
<td>OWASP</td>
<td><a href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/">A01:2022: Broken Access Control</a></td></tr>
<tr>
<td>OWASP</td>
<td><a href="https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF%29/">A10:2021: Server Side Request Forgery</a></td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 5.2</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 6.1</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 6.3</td></tr>

<tr>
<td>[SOC2](#soc2)</td>
<td>CC 7.1</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 7.2</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 7.3</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 8.1</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 8.2</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 8.3</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 9.1</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>CC 9.2</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>PI 1.2</td></tr>
<tr>
<td>[SOC2](#soc2)</td>
<td>PI 1.3</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 5.16</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 5.17</td></tr>

<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.2</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.7</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.9</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.10</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.16</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.18</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.21</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.22</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.25</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.29</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.30</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.31</td></tr>
<tr>
<td>[ISO 27001](#iso-27001) Information security controls reference</td>
<td>Annex A 8.32</td></tr></tbody></table>

## OWASP


### Server-side request forgery mitigations

An often overlooked aspect of attack vectors is server-side request forgery. In essence, an attacker sends (almost) random messages to the server and analyzes the response. Based on that, they are able to deduce behavioral patterns that can be used for a successful attack.

The most common goal of such attacks is to create some form of an overflow. Modern load-balancers and web-servers have built-in functionality that serve as a first line of defense against such mechanisms.

Functionality to look out for when creating your application is:

* Validate the user input against a given schema where possible.
* Limit the request size that the server accepts. This includes payload and header.
* Do not use redirections or symbolic links unless absolutely necessary.
* Use rate limits to make this attack infeasible.
* When writing user-input into a database, always use Object Relational Mappers to achieve maximal protection against SQL injection.

**References:**

* [OWASP A10:2021: Server Side Request Forgery](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_\(SSRF\)/)

**Examples for best practices:**

* ORM systems exist for almost all programming languages and frameworks. Some of the most common ones are [Hibernate](https://hibernate.org/orm/documentation/getting-started/), [TypeORM](https://typeorm.io) and [SQLAlchemy](https://www.sqlalchemy.org).
* In the Apache web-server, one can control the request size of different pieces of the request:
  * [LimitRequestBody](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestbody)
  * [LimitRequestFields](https://httpd.apache.org/docs/2.0/mod/core.html#limitrequestfields)
* In order to protect oneself from bad redirects, one can define proper [[CORS](#cors)] headers and a ContentSecurityPolicy[[CSP](#csp)]. Both are set in header fileds of your Web server or load balancer.

<div class="info">

**Links to risks**

* [GIR8](#risk-gir-8)
</div>

## SOC 2

### Control activities to achieve operational goals

In a nutshell: technology needs to serve the business goal, not the other way around.

Main outline from the COSO principles:

1. **Technology Infrastructure Control** — Stakeholders develop control activities over the technology infrastructure, ensuring accuracy, availability and completeness of data.
2. **Security Access Control** — External threats are analyzed and access rights are properly defined.
3. **Third Party tool integration** — Integration, management, and updates of third party tools is closely monitored.

**References:**

* CC 5.2 of the Trust Services Criteria

**Examples for best practices:**

* Every third party software that is brought in needs to be known, and proper change management applied to it.
* Every third party software needs to be analyzed for the correct access rights with respect to users who can access it, but also the privileges it needs on the system it runs on. \
  Examples for this are:
  * Do not run main processes as root, since a compromised software can then execute privileged operations.
  * Do not allow uncontrolled inbound and outbound networking traffic to this specific service.

<div class="info">

#### Assessment of activities' relevance helps address the following risks

* [GIR5](#risk-gir-5)
* [DOW18](#risk-dow-18)
* [DOW16](#risk-dow-16)
* [SLS11](#risk-sls-11)
* [SLS12](#risk-sls-12)
* [SLS13](#risk-sls-13)
* [SLS14](#risk-sls-14)
* [SLS15](#risk-sls-15)
* [SLS16](#risk-sls-16)
* [SLS17](#risk-sls-17)
* [SLS18](#risk-sls-18)
* [SLS1](#risk-sls-1)
* [SLS2](#risk-sls-2)
* [SLS3](#risk-sls-3)
* [SLS4](#risk-sls-4)
* [SLS5](#risk-sls-5)
</div>

### Risk assessment of one's own Node operation

Node operation does not equal node operation. There are subjective goals for each organization, and the way they decided to operate. This control ensures that one is always having an eye on risk assessments.

Main outline from the COSO principles:

1. Considers Tolerances for Risk — Identify what is acceptable.
2. Complies With Externally Established Frameworks — Consider local and international laws and benchmarks when developing the node operation.

**References:**

* CC 3.1 of the Trust Services Criteria

**Examples for best practices:**

* Ensure that every service, where possible, is configuration hardened using common benchmarks such as [CIS](https://www.cisecurity.org).
* Analyze each component in your infrastructure environment in terms of security, availability, processing integrity, confidentiality and privacy.
* Outline directly which risks are a high priority, and which ones are more acceptable, and the scenarios where it applies. For example, downtime comes only with an opportunity cost for ETH stakers, but may cause a slashing event in Polkadot.

<div class="info">

#### Internal risk assessment helps address the following risks

* [GIR24](#risk-gir-24)
</div>



### Capture configuration changes vulnerabilities

Main outline from the COSO principles:

* Uses defined Configuration Standards, monitor and enforce them.
* Detect configuration drift.
* Detect unwanted sofware installed on nodes.
* Conducts Vulnerability and Configuration security Scans.

**References:**

* CC 7.1 Trust services criteria

**Examples for best practices:**

* Many software pieces have defined configuration standards provided by [CIS benchmarks](https://www.cisecurity.org).
* Configuration standards can be enforced by automated software (e.g. [CoGuard](https://www.coguard.io))

<div class="info">

#### Managing configuration helps address the following risks

* [GIR4](#risk-gir-4)
* [KEC8](#risk-kec-8)
</div>




### Proper change management

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

**References:**

* CC 8.1 of the SOC 2 Trust Services Criteria

**Examples for best practices:**

* While this seems like a lot of points, most of them can be addressed by following the [GitOps lifecycle](https://about.gitlab.com/topics/gitops/#what-is-git-ops) to infrastructure.

<div class="info">

**Links to Risks**

* [SLS6](#risk-sls-6)
* [SLS7](#risk-sls-7)
* [GIR3](#risk-gir-3)
* [GIR18](#risk-gir-18)
* [GIR20](#risk-gir-20)
* [GIR21](#risk-gir-21)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
</div>

### Develop Risk Mitigation Activities

Main outline from the COSO principles:

* Regularly develop and improve Mitigation of Risks of Business Disruption -- This should be automated where possible.

**References:**

* CC 9.1 of Trust Services Criteria

<div class="info">

#### Risk mitigation helps address the following risks

* [DOW6](#risk-dow-6)
</div>

### Vendors and business partners risk management

Main outline from the COSO principles:

* Establishes Requirements for Vendor and Business Partner Engagements.
* Assesses Vendor and Business Partner Risks - A process is in place to evaluate existing vendors.
* Ensure that previously identified issues with vendors are fixed and regressions may be identified.
* Implements Procedures for Terminating Vendor Relationships.

**References:**

* CC 9.2 of Trust Services Criteria

<div class="info">

#### Counterparty management helps address the following risks

* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
* [GIR5](#risk-gir-5)
* [DOW1](#risk-dow-1)
* [DOW19](#risk-dow-19)
</div>


### Analyze system inputs for completeness and accuracy

Main outline from the COSO principles:

* Defines Characteristics of Processing Inputs, such as schemas.
* Evaluates Processing Inputs with defined requirements and compliance.
* Monitor the system inputs.

**References:**

* PI 1.2 of The Trust Services Criteria

**Examples for best practices:**

* Use [schema](https://json-schema.org) and [schema evolution techniques](https://en.wikipedia.org/wiki/Schema_evolution) to keep your data-flow clean.
* Always define minimum and maximum input sizes and MIME types ([Microsoft IIS example](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/mimemap)).

<div class="info">

#### Input analysis helps address the following risks

* [GIR8](#risk-gir-8)
</div>

### Analyze System outputs for completeness and accuracy

Main outline from the COSO principles:

* Inputs are processed completely, accurately, and timely.

**References:**

* PI 1.3 of the trust services criteria

**Examples for best practices:**

* Ensure that all inputs are being captured and either rejected or processed (schema enforcement).
* Data should be always referencable through a [unique ID](https://datatracker.ietf.org/doc/html/rfc4122).
* Data should be [examined for](https://www.npmjs.com/package/ajv) [correctness and completeness](https://github.com/validatorjs/validator.js).
* For each individual user, it should be determined if they are capable of accessing data or not. Using some technologies, such as [Apache Ranger](https://ranger.apache.org), this can be done on a row-by-row basis on a table.

<div class="info">

#### Output analysis helps address the following risks

* [GIR16](#risk-gir-16)
</div>

## ISO 27001



### Identity Management

Main outline of the Information security controls reference:

* The full life-cycle of a user or service identity needs to be managed.

**References:**

* [ISO 27001](#iso-27001) Annex A 5.16

**Examples for best practices:**

* Token lifetime.
* Off-boarding mechanisms.
* Potential use of 2FA

<div class="info">

#### Identity management helps address the following risks

* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
</div>

### Authentication Information

Main outline of the Information security controls reference:

* Setting, revoking and updating access control and authentication needs to be a highly controlled managed process.

**References:**

* ISO27001 Annex A 5.17

**Examples for best practices:**

* Use of a [Single Sign on](https://en.wikipedia.org/wiki/Single_sign-on) is preferred, and from there, all other secrets should be released to authorized users through e.g. [certificates](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Certificate-based_Authentication) and/or [vault mechanisms](https://developer.hashicorp.com/vault/docs/secrets/ssh/signed-ssh-certificates).

<div class="info">

#### Access control management helps address the following risks

* [SLS8](#risk-sls-8)
* [SLS9](#risk-sls-9)
</div>


### Protection against malware

Main outline of the Information security controls reference:

* Protection against malware needs to be implemented on all assets and users need to exercise proper caution.

**References:**

* ISO27001 Annex A 8.7

**Examples for best practices:**

* All dependencies should be checked for latest [CVE entries.](https://cve.mitre.org)

<div class="info">

#### Malware protection helps address the following risks

* [GIR15](#risk-gir-15)
* [GIR17](#risk-gir-17)
</div>

### Configuration Management

Main outline of the Information security controls reference:

* Any configurations of infrastructure components need to be documented, implemented, monitored and reviewed.

**References:**

* ISO27001 Annex A 8.9

**Examples:**

* This includes, but is not limited to:
  * Firewall configurations
  * Docker image setups
  * Container orchestration configurations
  * Database configurations
  * Webserver/Load balancer configurations
* Automated tools to track and scan for best practices are available (e.g. [CoGuard](https://www.coguard.io))

<div class="info">

#### Configuration Management helps address the following risks

* [GIR3](#risk-gir-3)
* [KEC8](#risk-kec-8)
</div>

### Information deletion

Main outline of the Information security controls reference:

* Information which is no longer required needs to be safely deleted.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.10

**Examples for best practices:**

* Definition and enforcement of retention periods.
* Use of thorough deletion mechanisms, such as [shred](https://man.archlinux.org/man/shred.1.en).

<div class="info">

#### Information Lifecycle management helps address the following risks

* [SLS10](#risk-sls-10)
* [DOW17](#risk-dow-17)
</div>


### Privileged utility programs

Main outline of the Information security controls reference:

* Any software in place that requires high privileges to run should be closely monitored, and as isolated as possible.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.18

**Examples for best practices:**

* Access to this application should be granted only using a certificate-based authentication which as a timeout.

<div class="info">

#### Access control management helps address the following risks

* [KEC11](#risk-kec-11)
* [GIR6](#risk-gir-6)
* [GIR7](#risk-gir-7)
</div>

### Network services

Main outline of the Information security controls reference:

* Any traffic needs to be monitored, analyzed and potentially alerted on.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.21

**Examples for best practices:**

* Segmentation of networks using security groups and subnets.
* Encryption in transit should always be enabled.
* Use and enforcement of IP whitelists

<div class="info">

#### Network management helps address the following risks

* [DOW10](#risk-dow-10)
</div>

### Segregation of networks

Main outline of the Information security controls reference:

* Use private subnets where possible, and minimize the systems that belong to a given subnet.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.22

**Examples for best practices:**

* [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918)
* [Kubernetes Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

<div class="info">

#### Network segmentation helps address the following risks

* [DOW10](#risk-dow-10)
* [GIR9](#risk-gir-9)
* [KEC8](#risk-kec-8)
</div>

### Secure development life cycle

Main outline of the Information security controls reference:

* Use best practices to ensure that software development is happening in a secure and monitored way.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.25

**Examples for best practices:**

* Use of CI/CD pipelines like GitHub Actions
* Use of Linters
* Use of enforced review processes
* Not allowing to directly push to the main branch

<div class="info">

#### Managed seecurity in development helps address the following risks

* [GIR8](#risk-gir-8)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
* [KEC8](#risk-kec-8)
* [GIR25](#risk-gir-25)
</div>

### Testing

Main outline of the Information security controls reference:

* Use all possible tests (dynamic, static) in the CI/CD pipeline of your development lifecycle.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.29

**Examples  for best practices:**

* Unit tests
* Dynamic tests
* Integration tests

<div class="info">

#### Testing helps address the following risks

* [GIR20](#risk-gir-20)
* [GIR21](#risk-gir-21)
* [DOW19](#risk-dow-19)
* [DOW20](#risk-dow-20)
</div>

### Outsourced development

Main outline of the Information security controls reference:

* Any outsourced development needs to be controlled, monitored and closely reviewed.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.30

**Examples for best practices:**

* Proper ticketing system with clear expectations.
* Minimal access to do the job.

<div class="info">

#### Counterparty management helps address the following risks

* [GIR24](#risk-gir-24)
</div>

### Separation of development, test and production environments

Main outline of the Information security controls reference:

* Development, testing and production environments shall be separated and secured. Additionally, they should be virtually the same minus DNS, credentials and IP addresses.

**References:**

* [ISO 27001](#iso-27001) Annex A 8.31

**Examples for best practices:**

* Use [docker-compose](https://docs.docker.com/compose/) or [minikube](https://minikube.sigs.k8s.io/docs/) to define local-production-like environments.
* Use infrastructure as code to be able to spin up and tear down test environments.
* Have well-defined interfaces to pull part of the production data into a local database for testing.

<div class="info">

#### testing environments help address the following risks

* [SLS6](#risk-sls-6)
* [SLS7](#risk-sls-7)
* [GIR11](#risk-gir-11)
* [GIR18](#risk-gir-18)
</div>

### Change management

Main outline of the Information security controls reference:

* Use change management systems (e.g. GIT) for any information processing changes (infrastructure and software).

**References:**

* [ISO 27001](#iso-27001) Annex A 8.32

**Examples for best practices:**

* Using GIT also for infrastructure code and configurations.
* Use database migration systems such as [Liquibase](https://www.liquibase.org).

<div class="info">

#### Change management helps address the following risks

* [DOW2](#risk-dow-2)
* [DOW11](#risk-dow-11)
* [GIR25](#risk-gir-25)
</div>

<section id="sec-communications-strategy">

## Communications Strategy

### Stakeholder Overview

#### Known Stakeholders

This type of stakeholders discloses the identity and provides contact details and channels for communication. Direct and close communication can be required.

##### **Institutional Stakers**

* High stake investors with potential of contractual obligations
* Generally require close contact and channels for direct contact

##### **Service Partners**

* Partners (e.g. Lido) operating and managing protocols and their respective Node Operator landscape and requiring governance votes
* Generally require close contact and channels for direct contact
* Emergency communication in case of incident

##### **Infrastructure Partners**

* Partners involved in hosting, managing or operating infrastructure as part of the node operation setup
* Need direct contact in case of emergency measure

##### **Media**

* Media channels, platforms, and accounts covering technical and non-technical news and reports
* Need for monitoring of business relevant news
* Need for close monitoring and engagement in case of incidents with business impact and public awareness

##### **Core & Client Dev Teams**

* Teams developing and maintaining critical node operations software
* Need for communication channel in case updates, maintenance and information around critical software components, especially in the event of software issues

##### Other Node Operators

* Node Operators running validators and similar tech stack
* Need for close monitoring of communication channels and alerting in case of published incidents with potential relevance for own setup

##### **Optional: Service Customers**

* Individuals or organizations using additional service provided by Node Operators (e.g., API users, customers for white-label solutions etc.)
* Need for direct customer service contact
* Need for information & updates in case of incidents

#### Mixed Stakeholders

These are entities that do not necessarily disclose their identity information, nor have identified channels of contact with Node Operators. They might follow available public channels such as X(Twitter), Discord, or public Telegram groups but can also operate entirely independently.

##### **Individual Stakers**

* Low stake investors
* Need for communication of status and incident updates across all public channels

##### **Communities**

* Individuals or organizations with diverse motivations (e.g., lobbyism, issues, questions, feedback, etc.)
* Need for public and anonymous communication platform

#### Communication Channels


Stakeholders' preferences for communication channels differ.
Where possible for known stakeholders it is good practice to identify individual channel preferences in advance.
It is important to include channels that enable mixed stakeholders to follow important developments.

##### Website

* Service offering
* Contact details
* Target Group: [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention"), [#mixed-stakeholders](stakeholder-overview.md#mixed-stakeholders "mention")

##### Email

* Available for any means of contact
* Target Group:  [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention"), [#mixed-stakeholders](stakeholder-overview.md#mixed-stakeholders "mention")

##### Telegram (Public)

* Focus on community engagement, incident updates, and information sharing
* Public accessibility to provide contact channels for anonymous stakeholders
* Target Group: [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention"), [#mixed-stakeholders](stakeholder-overview.md#mixed-stakeholders "mention")

##### Telegram (Private)

* Direct communication with relevant stakeholders
* Target Group: [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention")

##### Discord/Slack

* Direct communication channels with relevant stakeholders
* Focus on dialogue, community management, status updates, detailed updates in case of incidents and mitigations
* Target Group:  [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention"), [#mixed-stakeholders](stakeholder-overview.md#mixed-stakeholders "mention")

##### X (Twitter)

* Focus on marketing, high-level publication of updates, information in case of incidents, and mitigations
* Target Group:  [#known-stakeholders](stakeholder-overview.md#known-stakeholders "mention"), [#mixed-stakeholders](stakeholder-overview.md#mixed-stakeholders "mention")

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


##### [CSP]

"Content Security Policy", Mozilla Corporation. [https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

##### [CORS]

"Cross-Origin Resource Sharing (CORS)", Mozilla Corporation. [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

##### [CVE]

"CVE", Mitre, 1995-. [https://www.cve.org](https://www.cve.org)

##### [ISO 27001]

ISO IEC 27001:2022 "Information security, cybersecurity and privacy protection — Information security management systems — Requirements" 3rd Ed. ISO, 2022. [https://www.iso.org/standard/27001](https://www.iso.org/standard/27001)

##### [NIST-800-115]

"Technical Guide to Information Security Testing and Assessment", Karen Scarfone, Murugiah Souppaya, Amanda Cody, and Angela Orebaugh. NIST 2008. [https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

<a id="ref-premortem"></a>
##### [Pre-mortem]

"How to Use Pre-mortems to Prevent Problems, Blunders, and Disasters", Shreyas Doshi, 2020. [https://medium.com/@shreyashere/how-to-use-pre-mortems-to-prevent-problems-blunders-and-disasters-6ecc6df6e22a](https://medium.com/@shreyashere/how-to-use-pre-mortems-to-prevent-problems-blunders-and-disasters-6ecc6df6e22a)

##### [SBOM]

"Software Bill of Materials (SBOM)" CISA, 2024. [https://www.cisa.gov/sbom](https://www.cisa.gov/sbom)
##### [SOC2]

"2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy (With Revised Points of Focus — 2022)" AICPA 2022. [https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) (requires AICPA membership)

More:

- [NIST SP 800-34 Template](https://csrc.nist.gov/files/pubs/sp/800/34/r1/upd1/final/docs/sp800-34-rev1_cp_template_high_impact_system.docx)
- [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/): [OWASP A01:2022: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/), [OWASP A10:2021: Server Side Request Forgery](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF%29/)
- [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918)

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
