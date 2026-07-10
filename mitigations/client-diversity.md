---
id: sec-mit-client-diversity
title: Client Diversity
risks:
  - SLS6
  - SLS7
  - SLS20
  - DOW2
  - DOW19
  - DOW21
---
A diverse set of clients for different protocols can reduce "blast radius" in a case where one client has a protocol error or other bug.
This can be especially important if the bug causes a chain split.
A common scenario is when an upgrade introduces a problem.
The ability to migrate relevant keys to a different client, if a specific client error is observed, provides an important layer of protection.
In addition, maintaining client diversity helps ensure that the network as a whole does so,
ideally providing real protection against a vulnerability present in a single version of a single client by ensuring that particular version does not dominate the network.

Note that there are often a different range of clients available at different levels of the infrastructure.
For example in Ethereum, it is possible to run different clients on each of the Execution and Consensus layers.

##### Best practice for client diversity includes {#bp-client-diversity}

- Running multiple Execution and Consensus clients. See also [[[?ETHdiverse]]] [[?ETHdiverse]]

<div class="info">

##### Risks that client diversity can mitigate

* [SLS6](#risk-sls-6), [SLS7](#risk-sls-7), [SLS20](#risk-sls-20)
* [DOW2](#risk-dow-2), [DOW19](#risk-dow-19), [DOW21](#risk-dow-21)
</div>
