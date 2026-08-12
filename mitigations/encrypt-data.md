---
id: sec-mit-encrypt-data
title: Encrypted Data
risks:
  - KEC1
  - KEC6
  - HCK1
  - HCK2
  - HCK4
  - HCK6
  - GIR10
  - GIR17
  - RER1
  - RER2
---
Many different components interplay while a staking operation is going on.
If confidential information is not protected by encryption, it can be intercepted and read during transmission.
There is also a risk of accidental or malicious leaking of stored information, which can be somewhat mitigated if that information is stored in encrypted form.

It is therefore crucial to ensure that confidential data is only stored and transmitted in an encrypted state.

<div class="info">

##### Risks that data encryption can mitigate

* [KEC1](#risk-kec-1), [KEC6](#risk-kec-6)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK4](#risk-hck-4), [HCK6](#risk-hck-6)
* [GIR10](#risk-gir-10), [GIR17](#risk-gir-17)
* [RER1](#risk-rer-1), [RER2](#risk-rer-2)
</div>
