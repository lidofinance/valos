---
id: sec-mit-distribute-hardware
title: Physically Distributed Infrastructure
risks:
  - SLS1
  - DOW1
  - DOW5
  - DOW6
  - DOW7
  - DOW9
  - KEC6
  - HCK6
---
A single validator represents a single point of failure, that can introduce slashing or downtime risks.

[[?DVT]] (Distributed Validator Technology) provides an approach to mitigating this problem, by distributing the keys and the hardware that runs validation,
in such a way that multiple clients physically located in different places share the task of validation.
Thus if a single client or small number of them fail, the overall validation is unaffected.
(Note that while the Ethereum Foundation provides a specific technical specification for DVT that has been implemented
the principes can be implemented in different ways.)

Likewise, maintaining multiple validators running on separate hardware and software can increase resilience to a failure in any one platform.

<div class="info">

##### Risks that distributed Infrastructure can mitigate

* [SLS1](#risk-sls-1)
* [DOW1](#risk-dow-1), [DOW5](#risk-dow-5), [DOW6](#risk-dow-6), [DOW7](#risk-dow-7), [DOW9](#risk-dow-9)
* [KEC6](#risk-kec-6)
* [HCK6](#risk-hck-6)
</div>
