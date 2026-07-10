---
id: sec-mit-antislash-db
title: Local Anti-Slashing Database
risks:
  - SLS1
  - SLS2
  - SLS3
  - SLS4
  - SLS17
  - SLS18
  - SLS19
---
To avoid double signing, validators can maintain a history of messages they signed.
This data is crucial, as inconsistencies can cause a double-signing event.
The data needs to be reliably persistent, and properly connected to the systems that use it.

A common format for anti-slashing data is defined by [[[?EIP3076]]].

<details class="tools">
  <summary>Tools to support anti-slashing databases</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://lighthouse-book.sigmaprime.io/validator_slashing_protection.html">Lighthouse</a></li>
    <li><a href="https://chainsafe.github.io/lodestar/run/validator-management/validator-cli/#validator-slashing-protection-export">Lodestar</a></li>
    <li><a href="https://nimbus.guide/migration.html#2-export-slashing-protection-history">Nimbus</a></li>
    <li><a href="https://prysm.offchainlabs.com/docs/backup-and-migration/slashing-protection/#exporting-your-validators-slashing-protection-history">Prysm</a></li>
    <li><a href="https://docs.teku.consensys.io/how-to/prevent-slashing#export-a-slashing-protection-file">Teku</a></li>
  </ul>
</details>

<div class="info">

##### Risks that a local anti-slashing database can mitigate

* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS17](#risk-sls-17), [SLS18](#risk-sls-18), [SLS19](#risk-sls-19)
</div>
