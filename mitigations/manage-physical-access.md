---
id: sec-mit-manage-physical-access
title: Managed Physical Access
risks:
  - DOW3
  - DOW4
  - DOW7
  - DOW9
  - DOW10
  - GIR9
  - GIR17
  - HCK1
  - HCK2
  - HCK3
  - HCK4
  - HCK5
  - HCK6
---
This covers all physical devices that can access the Node, as well as all areas in which such devices are kept,
whether "on-premises", distributed, hosted by a third party, or remote mobile devices such as laptops.

Best practice for managing physical access includes ensuring that authorization is only granted as necessary,
following the principles of [Least Privilege](#def-least-privilege).
Generally this means some devices are physically segregated in areas where access is restricted according to function.
Note that this covers the use of devices authorized to access the networks that nodes operate on,
and is particularly important for devices authorized to access management and analytical functions of nodes.

Ideally all physical access to premises and facilities is monitored, to deter and determine whether the facility is subject to <dfn>piggybacking</dfn>.
This term refers to the situation where an unauthorized entrant is allowed in by someone who has a valid authorization for themselves.
In the context of remote operators' access through a computer, controlling this is particularly challenging in practice.

[=Piggybacking=] can occur inadvertently through politely holding a door for someone without checking that they have current valid authorization to enter,
negligently by allowing someone to enter for a legitimate purpose despite knowing that person does not have valid authorization,
or maliciously allowing someone to enter knowing that their purpose is nefarious.

In the inadvertent case, relevant mitigations include

- ensuring that all those with authorization understand the necessity to enforce physical access control,
- providing simple and effective ways to check authorization,
- ensuring that remote access devices as far as possible are dedicated to the defined purposes
(rather than allowing the use of general-purpose laptops that could be attacked when being used for a different task such as general email, or playing games).

To minimize negligently allowed access, it is important to ensure that access systems are effectively maintained and managed to ensure there is no good reason to allow an unauthorized person access.
This can range from the design of onboarding systems to the effectiveness of internal management feedback systems for discovering unanticipated problems faced by operators.

Best practice includes managing physical access with systems that can efficiently enable access to authorized parties (keycards, biometric scanners),
and monitor actual access such as visual verification that the authorized party is the one entering.

It is important to log and audit access sufficiently frequently to detect problems - see also [Monitoring](#sec-mitigations-monitoring).


<div class="info">

##### Risks that managed physical access can mitigate

* [DOW3](#risk-dow-3), [DOW4](#risk-dow-4), [DOW7](#risk-dow-7), [DOW9](#risk-dow-9), [DOW10](#risk-dow-10)
* [GIR9](#risk-gir-9), [GIR17](#risk-gir-17)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4), [HCK5](#risk-hck-5), [HCK6](#risk-hck-6)

</div>
