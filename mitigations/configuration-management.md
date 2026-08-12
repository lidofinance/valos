---
id: sec-mit-configuration-management
title: Configuration Management
risks:
  - SLS1
  - SLS3
  - SLS4
  - SLS5
  - SLS6
  - DOW12
  - DOW13
  - DOW21
  - HCK2
  - HCK3
  - HCK6
  - GIR3
  - GIR4
---
It is important to manage the configuration of hardware, and software. A minimal profile helps reduce possible attack surface,
while minimizing, and carefully tracking, customization is important to ensure smooth and safe upgrades.

Software configuration to follow includes, among others:
  * Firewall configurations
  * Docker image setups
  * Container orchestration configurations
  * Database configurations
  * Webserver/Load balancer configurations


<details class="tools">
  <summary>Tools to support configuration management</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://www.cisecurity.org">CIS benchmarks</a></li>
    <li><a href="https://www.coguard.io">CoGuard</a></li>
    <li>Using GIT to manage configurations</li>
    <li><a href="https://www.liquibase.org">Liquibase</a></li>
  </ul>
</details>

<div class="info">

##### Risks that managing configuration can mitigate

* [SLS1](#risk-sls-1), [SLS3](#risk-sls-3), [SLS4](#risk-sls-4), [SLS5](#risk-sls-5), [SLS6](#risk-sls-6)
* [DOW12](#risk-dow-12), [DOW13](#risk-dow-13), [DOW21](#risk-dow-21)
* [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK6](#risk-hck-6)
* [GIR3](#risk-gir-3), [GIR4](#risk-gir-4)
</div>
