---
id: sec-mit-comms-stakeholders
title: Stakeholder Communication Management
risks:
  - FIN1
  - FIN6
  - FIN7
  - SPS0
  - RER1
  - RER3
---
Some key stakeholders are <dfn>Anonymous Stakeholders</dfn>, who might follow a Node Operator's public information channels,
or operate independently, but who do not provide individual communication information to Operators.

* Low stake investors
* Potential investors
* Communities developing technical standards
* Education Providers
* Corporate Regulators

Regulators of various kinds can require that Node Operators provide them with specific information,
but do not necessarily communicate with Node Operators on an individual basis

Node operators will also have <dfn>Known Stakeholders</dfn>, who have an identity known to the Node Operator
that includes at least one direct communications channel such as messaging, email, or telephone. These typically include at least some of

* High stake investors - with some of whom the Operator could also have contractual obligations
* Service Partners, who might be involved in operating and managing protocols and requiring governance votes, or hosting, managing or operating infrastructure as part of the node operation setup
* Media channels, platforms, and accounts covering technical and non-technical news and reports
* Other Node Operators running validators on the same network
* Staff such as those developing and maintaining critical node operations software
* Individuals or organizations using additional service provided by Node Operators (e.g., API users, customers for white-label solutions etc.)

Stakeholders' preferences for communication channels differ. While many [=Known Stakeholders=] will have explicitly requested direct communication,
it is important to have additional channels that enable [=Anonymous Stakeholders=] to follow important developments.

Broadly, communication channels can be considered <b>two-way</b>, enabling communication with an individual Known Stakeholder or with all of them at once,
or <b>broadcast</b>, enabling [=Anonymous Stakeholders=] to receive important information, often while preserving their anonymity.

Additionally, some mechanisms allow for persistent information, while others are only temporary;
A website can be maintained long-term or the information can be removed, information sent by email can easily be retained by the recipient in perpetuity,
while information in e.g. a Slack or Telegram channel could be deleted after a matter of days or weeks

It is also important, especially for services used for two-way communication with [=Known Stakeholders=], to consider the security and privacy of the channels used.
While channels such as Telegram or Whatsapp use encryption, in the case of the former all communication is decoded at some unknown centralized point, in the latter large amounts of metadata are available to the service provider.

While many messaging services can behave in either manner, some such as websites are well-suited to broadcast communication
and others are more suited to individual two-way communication.

As well as identifying the most appropriate channels for communication with [=Known Stakeholders=] or classes of [=Anonymous Stakeholders=],
it is important to understand what it is appropriate to communicate, and to whom.
Some stakeholders will expect a "close management", with direct individualized two-way communication,
and very rapid reporting on incidents and important information.
Others will want to know that they are informed in case of security incidents, or important regulatory changes,
but prefer a lower volume of information. It is likely that different circumstances will mean that a given Stakeholder moves between "categories",
with different communications strategies or procedures being more appropriate depending on specific context.

##### Best practices for stakeholder management include {#bp-stakeholder-management}

- Track and categorise [=Known Stakeholders=]
- Assess communication tools relevant to [=Anonymous Stakeholders=]

<details class="tools">
  <summary>Tools to support stakeholder management</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li>Broadcast communication tools include Websites, X (the former Twitter), BlueSky, Facebook/Instagram</li>
    <li><a href="assets/images/stakeholder-map.png">A Stakeholder Map</a></li>
    <li><a href="https://docs.google.com/spreadsheets/d/1ovBZbYhR5c-l83F4KKgNKam8igAKPASS">A Stakeholder Register Spreadsheet</a></li>
    <li>CRM systems</li>
    <li>Email</li>
    <li>Messaging services such as Telegram, Discord, Slack, Signal, and Whatsapp</li>
  </ul>
</details>

A number of jurisdictions (such as the EU, with the [[?GDPR]]) regulate the use of information about individuals,
and it is important to understand and comply with such regulations to avoid reputational, legal and financial risks.

<div class="info">

##### Risks that stakeholder management can mitigate

* [FIN1](#risk-fin-1), [FIN6](#risk-fin-6), [FIN7](#risk-fin-7)
* [SPS0](#risk-sps-0)
* [RER1](#risk-rer-1), [RER3](#risk-rer-3)
</div>
