---
id: sec-mit-signature-management
title: Signature Management
risks:
  - FIN3
  - FIN4
  - SLS1
  - SLS2
  - SLS3
  - SLS4
  - SLS5
  - SLS14
  - SLS15
  - KEC1
  - KEC6
  - KEC9
  - HCK3
  - GIR7
---
Tools that manage signatures for transactions generally provide a workflow that includes passive and active protection against a variety of risks.
Using these tools helps minimize the chances that a signature is given without checking what is being signed,
and that risk-bearing transactions require appropriate authorization.

Properly configured signature management tools also provide the ability to recover, or mitigate any problems,
in the case where a transaction was not completed.

As well as the use of various kind of "<dfn>multi-sig</dfn>", which can include simple requirements for multiple signatures,
or incorporate such techniques as multi-part compute ("MPC") or the like,
signature management tools can include automated verification steps in the process of authorizing a transaction.

<details class="tools">
  <summary>Tools to support signature management</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://github.com/attestantio/dirk">Dirk</a></li>
    <li><a href="https://docs.web3signer.consensys.net">Web3Signer</a></li>
  </ul>
</details>


<div class="info">

##### Risks that signature management can mitigate

* [FIN3](#risk-fin-3), [FIN4](#risk-fin-4)
* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS5](#risk-sls-5), [SLS14](#risk-sls-14), [SLS15](#risk-sls-15)
* [KEC1](#risk-kec-1), [KEC6](#risk-kec-6), [KEC9](#risk-kec-9)
* [HCK3](#risk-hck-3)
* [GIR7](#risk-gir-7)
</div>
