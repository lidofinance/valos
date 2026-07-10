---
id: sec-mit-doppelganger-protection
title: Doppelgänger Protection
risks:
  - SLS1
  - SLS2
  - SLS5
  - DOW2
  - DOW10
  - SPS0
---
If two validators with the same identifiers are running at the same time is important to shut one down as fast as possible.
Most validators provide built-in mechanisms to detect doppelgangers. Other tools and technicques can also detect and act on this.

<details class="tools">
  <summary>Tools to support Doppelgänger protection</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://lighthouse-book.sigmaprime.io/validator_doppelganger.html">Lighthouse</a></li>
    <li><a href="https://prysm.offchainlabs.com/docs/backup-and-migration/slashing-protection">Prysm</a></li>
    <li><a href="https://docs.teku.consensys.io/how-to/prevent-slashing/detect-doppelgangers">Teku</a></li>
    <li><a href="https://nimbus.guide/doppelganger-detection.html">Nimbus</a></li>
    <li><a href="https://pkg.go.dev/github.com/ssvlabs/ssv/doppelganger">Doppelganger protection in `ssv.network`</a></li>
    <li><a href="https://github.com/SimplyStaking/DoppelBuster">DoppelBuster</a></li>
    <li>StatefulSet handling in Kubernetes</li>
  </ul>
</details>

<div class="info">

##### Risks that doppelgänger protection can mitigate

* [SLS1](#risk-sls-1), [SLS2](#risk-sls-2), [SLS5](#risk-sls-5)
* [DOW2](#risk-dow-2), [DOW10](#risk-dow-10)
* [SPS0](#risk-sps-0)
</div>

<details class="tools">
  <summary>Tools to support Monitoring</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li>Within AWS, Cognito's <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html">Userpool Addons for auditing authentications</a> and the <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html">WAF module</a> to filter anomalies are just examples of the range of tools available</li>
    <li><a href="https://www.elastic.co/elastic-stack/">ELK stack</a></li>
    <li><a href="https://github.com/attestantio/esd">ESD monitors slashing events on the Ethereum chain</a></li>
    <li><a href="https://github.com/lidofinance/ethereum-validators-monitoring">Ethereum validator monitoring</a></li>
    <li><a href="https://grafana.com/docs/grafana/latest/alerting/set-up/">Grafana- an example of an alerting setup in Grafana</a></li>
    <li><a href="https://github.com/SimplyStaking/eth-block-proposal-monitor">MEV monitoring tool from SimplyStaking</a></li>
    <li><a href="https://prometheus.io/docs/introduction/overview/">Prometheus</a></li>
    <li><a href="https://wazuh.com">Wazuh</a></li>
  </ul>
</details>
