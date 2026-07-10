## Risk Mitigation Strategies {#sec-mitigation}

This Mitigation Strategies section serves as a go-to resource for node operators,
providing actionable insights and mitigation options to enhance the security, reliability, and efficiency of their operations.

Most of the best practices that optimize up-time, access control and general stability directly apply to operating a node properly.
However, for some risks specific to running a node operator, high levels of process segregation need to be achieved for mitigation to be effective.


### Risk Management {#sec-mitigations-risk-management}

A core principle for mitigating risks is to actively identify and manage the risks.
This means understanding the particular risks, the likelihood of something going wrong, and the likely impact if that does occur.
That information enables a Node Operator to decide what level of risk is reasonable and how to prioritise available resources to mitigate risk.

Risk management decisions need to take into account any regulation that obliges a Node Operator to meet specific benchmarks or implement specific mitigation strategies
or other activities.

A first step for effective risk management is to document the potential risks, as well as the tools and processes currently in place to address those risks.

Documentation needs to include an assessment of the relevant risks, an explanation of what level of risk is acceptable and why,
and how each process or infrastructure component contributes to and protects against risks.

This enables Node Operators to identify activities that are not contributing to the business, or that actually increase the potential risks they face.
The accuracy, availability and completeness of this information is of crucial import.

<!-- @mitigation sec-mit-assess-risk -->

<!-- @mitigation sec-mit-assess-risk-impact -->

<!-- @mitigation sec-mit-assess-risk-probability -->

### People Management {#sec-mitigations-manage-people}

Unless a validator system is immutable and fully automated, there will be people involved in managing it.
It is therefore important that appropriate management of people is part of managing the validator node.
This impacts in various areas, from mitigating the risk of hacking by unknown parties with access to privileged roles,
to the ability to provide timely incident response and minimize the damage caused by a security incident.

As well as the [Controls for People Management](#sec-controls-people-management) some relevant controls are grouped with other areas, such as
- [Limit Physical Access](#req-protect-server-locations)
- [Minimize Authorization](#req-least-privilege)
- [Log Personnel Information](#req-log-personnel)

<!-- @mitigation sec-mit-identified-individuals -->

<!-- @mitigation sec-mit-training -->

### Technology Stack {#sec-mitigations-tech-stack}

In a nutshell: technology needs to serve the business goal, not the other way around.

To ensure this happens, it is important to consider both the business goals and the available technology,
and then use appropriate technology to meet those goals.

<!-- @mitigation sec-mit-update-software -->

<!-- @mitigation sec-mit-antislash-db -->

<!-- @mitigation sec-mit-signature-management -->

<!-- @mitigation sec-mit-client-diversity -->

<!-- @mitigation sec-mit-delinquent-state -->

### Information and Secret Management {#sec-mitigations-secret-management}

Information management can mitigate many risks.
One aspect is the management of highly confidential information, such as the management of signing keys or withdrawal keys,
but it is also important to manage operational information.

<!-- @mitigation sec-mit-control-secret-access -->

<!-- @mitigation sec-mit-encrypt-data -->

<!-- @mitigation sec-mit-cold-storage -->

<!-- @mitigation sec-mit-key-management -->

<!-- @mitigation sec-mit-operational-info-management -->

<!-- @mitigation sec-mit-deletion-protection -->

### Access Controls and Access Management {#sec-mitigations-access-management}

Access Control covers physical access to devices and facilities, the ability to connect to servers through networks,
and the ability to perform specific tasks, such as getting answers to requests.

The core principle to follow in granting authorization is [=Least Privilege=].
This is generally achieved by using some form of [=Role-Based Access Control=], in combination with an inventory of assets and services, to ensure that only those who need access are granted that access, and that it is revoked as soon as appropriate.

Tracking this information is important to ensure that access can be audited and verified.

<details class="tools">
  <summary>Tools to support access control</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html">AWS IAM</a></li>
    <li><a href="https://github.com/attestantio/dirk">Dirk</a></li>
    <li><a href="https://docs.web3signer.consensys.net">Web3Signer</a></li>
  </ul>
</details>

<div class="info">

##### Access control helps address the following risks

* [FIN1](#risk-fin-1)
* [DOW7](#risk-dow-7), [DOW16](#risk-dow-16)
* [GIR1](#risk-gir-1), [GIR7](#risk-gir-7), [GIR9](#risk-gir-9), [GIR16](#risk-gir-16), [GIR22](#risk-gir-22)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4)
* [KEC2](#risk-kec-2), [KEC4](#risk-kec-4)
* [SPS0](#risk-sps-0)


</div>

<!-- @mitigation sec-mit-least-privilege -->

<!-- @mitigation sec-mit-employee-auth-management -->

<!-- @mitigation sec-mit-manage-network-access -->

<!-- @mitigation sec-mit-auth-policies -->

### Managing Hardware {#sec-mitigations-environment}

Physical devices are subject to physical changes, including environmental issues such as temperature extremes that can cause damage,
and utility failures such as power or internet failure.

<!-- @mitigation sec-mit-manage-physical-access -->

<!-- @mitigation sec-mit-distribute-hardware -->

<!-- @mitigation sec-mit-protect-utilities -->

<!-- @mitigation sec-mit-protect-from-environment -->

<!-- @mitigation sec-mit-manage-equipment-life -->

### Software Development and Update Process {#sec-mitigations-development-and-updates}

<!-- @mitigation sec-mit-ssdlc -->

<!-- @mitigation sec-mit-code-testing -->

<!-- @mitigation sec-mit-validate-inputs-outputs -->

### Manage Software Updates  {#sec-mitigations-manage-updates}

Updating software is a major risk vector. Good processes for software development and managing the deployment of updates are important to mitigate some of this risk.
As well as having control over the update process, it is important to have the capacity to revert to a known environment in an emergency where an update has been found to introduce unexpected problems.

<!-- @mitigation sec-mit-minimize-customizing-software -->

<!-- @mitigation sec-mit-configuration-management -->

<!-- @mitigation sec-mit-protect-against-malware -->

<!-- @mitigation sec-mit-test-predeployment -->

<!-- @mitigation sec-mit-containerized-environments -->

<!-- @mitigation sec-mit-process-automation -->

### Monitoring, Logging and Alerting {#sec-mitigations-monitoring}

Monitoring is an important tool to identify risks and gain relevant data, and some requirement for it is a very common feature of compliance and security frameworks.

Monitoring takes many forms. It can be done internally, and provided as a service.
The latter is especially common for monitoring the health of widely available third-party infrastructure such as blockchains, and cloud services.

Monitoring can take place throughout the ecosystem. Low-level indicators such as whether network traffic is within expected or design parameters,
whether databases are being updated at expected rates, or whether server facilities are maintaining an appropriate temperature are all examples of monitoring
with fairly obvious value, and where immediate remediations or further investigation is straightforward.

Monitoring access to physical infrastructure is more complex, and the resulting information about people is subject to privacy requirements,
but can be a useful diagnostic tool if something goes very wrong, or if you just want to know who keeps blocking the server-room door open on warm days.

As well as monitoring in real time, logging information allows analysis to discover information that is only observable though variations
(or non-variations) in specific monitored information over time.

Given the importance of logged information, and of privacy requirements, best practice is to have a clearly documented policy for record retention.
This needs to retain enough information to enable historical analysis and comparison.
Some data are best only retained in anonymized form, or stored with extra security provisions applied.

A good monitoring system provides very broad coverage, with redundancy both as an aspect that can be monitored to detect anomalies
and to eliminate the risk of a single point of failure - when monitoring is compromised it can indicate a simple failure of the monitoring system,
but can also mask a broader issue that the system is expected to detect.

With a good monitoring system in place providing broad coverage of operations, there needs to be useful and targeted alerting system based on the monitoring system.

To learn that a potential problem has been identified, as soon as possible, and act on it effectively, a monitoring system needs a robust targeted alerting system.
A system that overloads its watchers with alerts is likely to lead to <b>alert fatigue</b>,
where the alerts are ignored in practice because too often they require an onerous human response when they are not identifying a real problem.
Like monitoring systems in general, redundancy in alert systems is important.

Knowing an incident has occurred can trigger an [=Incident Response Plan=], but if it relies on individuals, it is important to provide 24/7 response.
Many attacks are deliberately targeted for times when responders are less likely to have high availability.

Alert systems can in turn drive automated emergency responses, ranging from capture of increased levels of detail,
through requesting additional authorization beyond the normal requirements, to full system shutdowns.

Here again, there are important trade-offs between ensuring a highly responsive system, and one that is robust in the face of real-world variability.
For example, a system that can automatically suspend [=multi-sig=] transactions unless they are authorized within a short time is not always appropriate,
because it can interfere with normal operations over a high-latency network or where a number of individuals are expected to coordinate extensively,
taking a significant amount of time, before authorizing a particular action.

Among many aspects of Validator Operations to monitor directly are the following:

<!-- @mitigation sec-mit-monitor-blockchain -->

<!-- @mitigation sec-mit-monitor-systems -->

<!-- @mitigation sec-mit-monitor-compliance -->

<!-- @mitigation sec-mit-monitor-upgrades -->

<!-- @mitigation sec-mit-doppelganger-protection -->

### Communications and Incident Response {#sec-mitigations-incident-response}

Communication is important both during normal operations, and when an exceptional security incident occurs that could adversely affect the normal operations, or the users of a system.

There are therefore two core parts to a Nore Operator's communication strategy:

- Normal Operational Communication provides information about ongoing operations, to ensure confidence in and transparency of everyday operations.
- <dfn>Incident Communication</dfn> is the collection of communications processes that occur as part of an [=Incident Response Plan=]

Developing appropriate communication procedures relies on understanding both the communications channels an organization has or can have, and its stakeholders.
The goal is to ensure those stakeholders have timely access to relevant information in a useful format.

<!-- @mitigation sec-mit-comms-stakeholders -->

<!-- @mitigation sec-mit-incident-response -->

<!-- @mitigation sec-mit-identify-incidents -->

<!-- @mitigation sec-mit-incident-learning -->

<!-- @mitigation sec-mit-disaster-recovery -->

<!-- @mitigation sec-mit-incident-simulation -->

<!-- @mitigation sec-mit-incident-communication -->
