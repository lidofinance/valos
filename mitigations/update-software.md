---
id: sec-mit-update-software
title: Update Third-party Software
risks:
  - FIN1
  - SLS1
  - SLS2
  - SLS3
  - DOW4
  - DOW12
  - DOW21
  - GIR4
  - GIR6
  - GIR16
  - GIR18
  - GIR21
  - GIR22
  - GIR25
  - KEC6
  - KEC9
  - SPS1
  - RER1
  - RER2
  - RER3
  - RER4
  - RER5
---
Updates to software components provided by third-parties often address newly-discovered or longstanding vulnerabilities.
It is a best practice to update software regularly, but it is important to [check for vulnerabilities](#req-check-vulnerabilities)
that can be introduced by an upgrade as part of a supply-chain attack, and to verify that any customization of open-source software, or
[specific configuration](#req-check-config-on-update) options, as well as other software used by the node operator,
are all compatible with an update and do not create new vulnerabilities on updating.

##### Best practices for updating software include {#bp-updating-software}

- "version-pinning"
- actively managing dependencies
- testing updates before automatically deploying them

##### Relevant controls for updated software {#controls-for-updated-software}

  - [Controls for Development and Update](#sec-controls-updates)

<div class="info">

##### Risks that updated software can mitigate

* [FIN1](#risk-fin-1)
* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3)
* [DOW4](#risk-dow-4), [DOW12](#risk-dow-12), [DOW21](#risk-dow-21)
* [GIR4](#risk-gir-4), [GIR6](#risk-gir-6), [GIR16](#risk-gir-16), [GIR18](#risk-gir-18), [GIR21](#risk-gir-21), [GIR22](#risk-gir-22), [GIR25](#risk-gir-25)
* [KEC6](#risk-kec-6), [KEC9](#risk-kec-9)
* [SPS1](#risk-sps-1)
* [RER1](#risk-rer-1), [RER2](#risk-rer-2), [RER3](#risk-rer-3), [RER4](#risk-rer-4), [RER5](#risk-rer-5)
</div>
