---
id: sec-mit-manage-network-access
title: Managed Network Access to Nodes
risks:
  - HCK4
  - GIR9
  - GIR17
---
Following the principles of defense in depth and [**least privilege**](#def-least-privilege), it is important that nodes are not directly accessible without permission, and that they do not leak information to the Web that can help malicious parties gain unauthorized access.

##### Best practices for managed network access include {#bp-managed-network-access}

* An internal virtual private network with only have well-defined endpoints accessible from the web
* A load-balancer that has a firewall
* Disable meta-data serving through public endpoints (e.g. port scans, or what server is running in what version)
* Limits on outbound traffic of a node that runs a certain service
* Rate limits to ensure that internal services cannot unintentionally DDos each other
* Require explicit authorization of external access capability

<div class="info">

##### Risks that managed network access can mitigate

* [HCK4](#risk-hck-4)
* [GIR9](#risk-gir-9), [GIR17](#risk-gir-17)
</div>
