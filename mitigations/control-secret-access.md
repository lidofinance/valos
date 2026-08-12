---
id: sec-mit-control-secret-access
title: Controlled and Audited Secret Access
risks:
  - FIN1
  - SLS5
  - KEC1
  - KEC6
  - KEC9
  - HCK1
  - HCK2
  - HCK4
  - HCK6
  - GIR25
---
Best practice for credential management is to use a [Single Sign on](https://en.wikipedia.org/wiki/Single_sign-on) system,
that gives users authorized access to secrets through e.g. [certificates](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Certificate-based_Authentication),
and/or [vault mechanisms](https://developer.hashicorp.com/vault/docs/secrets/ssh/signed-ssh-certificates).

In this way, everything is audited, and anomaly detection can be activated for those vaults.

Using [=multi-sig=] wallets requiring authorization from multiple parties for specific actions, helps to ensure both that relevant access is monitored and that it is correctly controlled.

<div class="info">

##### Risks that secret access management can mitigate

* [FIN1](#risk-fin-1)
* [SLS5](#risk-sls-5)
* [KEC1](#risk-kec-1), [KEC6](#risk-kec-6), [KEC9](#risk-kec-9)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK4](#risk-hck-4), [HCK6](#risk-hck-6)
* [GIR25](#risk-gir-25)
</div>
