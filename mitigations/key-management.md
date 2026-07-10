---
id: sec-mit-key-management
title: Key Management
risks:
  - FIN1
  - SLS1
  - SLS3
  - SLS5
  - KEC1
  - KEC6
  - KEC7
  - KEC9
  - HCK1
  - HCK2
  - HCK3
  - HCK4
  - HCK6
  - GIR6
  - GIR7
  - GIR14
  - GIR16
  - GIR18
---
Operating a node normally entails the use of a range of keys, such as

* Keys used by signature management tools
* A vault
* SSH keys
* API keys for cloud infrastructure

It is important to protect private keys from accidental or malicious misuse, and in particular unplanned deletion.
It is not normal to provide broad access to unencrypted signing keys.

##### Best practices for key management include {#bp-key-management}

- follow relevant standards such as [[[?CCSS]]] and [[[?KMS]]]
- ensuring that there are no single individuals with the capability to access or delete them,
- having backups with strong acess control,
- actively managing access to keys and key material, and
- "key rotation", i.e. periodic changes of keys as well as rapid managed changes if a data breach occurs.

Modern vault systems enable the enforcement of policies to ensure that access to keys is only available with verified roles, and deletion is managed according to established protocols.

<details class="tools">
  <summary>Tools to support key management</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://github.com/attestantio/dirk">Dirk</a></li>
    <li><a href="https://docs.web3signer.consensys.net">Web3Signer</a></li>
  </ul>
</details>

<div class="info">

##### Risks that key management can mitigate

* [FIN1](#risk-fin-1)
* [SLS1](#risk-sls-1), [SLS3](#risk-sls-3), [SLS5](#risk-sls-5)
* [KEC1](#risk-kec-1), [KEC6](#risk-kec-6), [KEC7](#risk-kec-7), [KEC9](#risk-kec-9)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4), [HCK6](#risk-hck-6)
* [GIR6](#risk-gir-6), [GIR7](#risk-gir-7), [GIR14](#risk-gir-14), [GIR16](#risk-gir-16), [GIR18](#risk-gir-18)
</div>
