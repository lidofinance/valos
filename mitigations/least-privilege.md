---
id: sec-mit-least-privilege
title: Least Privilege
risks:
  - FIN1
  - KEC7
  - HCK1
  - HCK2
  - HCK3
  - HCK4
  - HCK6
  - SPS0
---
The core of <dfn id="def-least-privilege">Least Privilege</dfn> is that access is only granted to those who need it, and only for as long as it is relevant. This means that an individual user's privileges are likely to change over time, and in particular any offboarding process includes a rapid revocation of user's assigned roles.

Almost all Least Privilege implementation is managed through <dfn>Role-based Access Control</dfn> (commonly known as "<abbr>RBAC</abbr>"), where a set of roles are defined according to the tasks they need to perform,
and access rights are based on holding a particular role,
with individual users assigned relevant roles that are revoked or deliberately renewed on a timely basis.
It is important to ensure that individuals can fulfil their designated tasks,
without having authorizations they do not need.

##### Best practices for access control include {#bp-access-control}

* A [Single Sign on](https://en.wikipedia.org/wiki/Single_sign-on) mechanism that allows rapid assigning and revoking of roles
* Authentication tokens that have a limited lifetime
* Regular review of roles and permissions for both users and software
* Disable privilege escalation mechanisms ([e.g. executing as root user in Docker](https://docs.docker.com/engine/reference/commandline/container_exec/), `docker exec -uroot`, or [impersonation in Keycloak](https://www.keycloak.org/docs/latest/server_admin/index.html#con-user-impersonation_server_administration_guide))
* Use of roles on the API endpoint level to determine the correct authorization.

<details class="tools">
  <summary>Tools to support least privilege control</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://aws.amazon.com/cognito/">Cognito</a></li>
    <li><a href="https://www.keycloak.org">Keycloak</a></li>
  </ul>
</details>

<div class="info">

##### Risks that least privilege can mitigate

* [FIN1](#risk-fin-1)
* [GIR7](#risk-gir-7), [GIR9](#risk-gir-9),  [GIR16](#risk-gir-16), [GIR22](#risk-gir-22), [GIR25](#risk-gir-25)
* [KEC7](#risk-kec-7)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4), [HCK6](#risk-hck-6)
* [SPS0](#risk-sps-0)

</div>
