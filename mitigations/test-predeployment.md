---
id: sec-mit-test-predeployment
title: Deployment testing environments
risks:
  - SLS6
  - SLS7
  - SLS14
  - DOW2
  - DOW11
  - DOW12
  - DOW13
  - DOW14
  - DOW20
  - DOW21
  - GIR11
  - GIR13
  - GIR18
  - GIR20
  - GIR21
---
Use separate tests and staging environments

This minimizes a potential blast radius. It is important to run any change (even an update of a validator software or Web3Signer) through a test environment first to maximize the likelihood that any errors can be discovered before they impact a production environment.

<details class="tools">
  <summary>Tools to support deployment testing</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li>The "Blue-Green Deployment pattern" [[[?WikipediaBG]]] [[?WikipediaBG]]</li>
  </ul>
</details>

<div class="info">

##### Risks that deployment testing can mitigate


* [SLS6](#risk-sls-6), [SLS7](#risk-sls-7), [SLS14](#risk-sls-14)
* [DOW2](#risk-dow-2), [DOW11](#risk-dow-11), [DOW12](#risk-dow-12), [DOW13](#risk-dow-13), [DOW14](#risk-dow-14), [DOW20](#risk-dow-20), [DOW21](#risk-dow-21)
* [GIR11](#risk-gir-11), [GIR13](#risk-gir-13), [GIR18](#risk-gir-18), [GIR20](#risk-gir-20), [GIR21](#risk-gir-21)
</div>
