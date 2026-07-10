---
id: sec-mit-minimize-customizing-software
title: Avoid Customizing Third-party Software
risks:
  - SLS5
  - SLS7
  - DOW2
  - DOW13
  - DOW19
  - DOW20
  - DOW21
  - HCK2
  - HCK3
  - GIR3
  - GIR16
  - RER1
  - RER4
---
Validator software, and other software validators use, is very often open source.
However, customizing software can introduce errors.
In addition customizations can produce incompatibilities when software is updated.

This means that any customization introduces a need for continued extra testing,
in particular whenever relevant software is updated.
Customization also increases the risk that test coverage is inadequate,
meaning a future error will not be found in pre-deployment testing and only discovered through a failure operating in production,
with attendant risks of reputational damage, direct losses, and increased cost for incident management.

<div class="info">

##### Risks that not customizing third-party software can mitigate

* [SLS5](#risk-sls-5), [SLS7](#risk-sls-7)
* [DOW2](#risk-dow-2), [DOW13](#risk-dow-13), [DOW19](#risk-dow-19), [DOW20](#risk-dow-20), [DOW21](#risk-dow-21)
* [HCK2](#risk-hck-2), [HCK3](#risk-hck-3)
* [GIR3](#risk-gir-3), [GIR16](#risk-gir-16)
* [RER1](#risk-rer-1), [RER4](#risk-rer-4)
</div>
