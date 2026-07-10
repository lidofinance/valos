---
id: sec-mit-validate-inputs-outputs
title: Validated Inputs and Outputs
risks:
  - DOW10
  - KEC6
  - KEC7
  - KEC9
  - HCK1
  - HCK2
  - HCK3
  - HCK4
  - HCK5
---
Unchecked inputs are a major vector for a range of attacks. These include

- brute force authorization, or denial of service (including DDoS) attacks, often identifiable by a high rate of failing requests using inputs with minimal variation
- overflow attacks, where excessive input causes a problem, generally mitigated by programming practices or overflow-safe languages
- targeted efforts to inject code that executes functionality that should not be authorized, or causes an adverse system reaction including a crash

Ideally, the load balancer in front of the node filters out all traffic with payloads that cause overflow.
Additionally, it is important to validate inputs against the relevant parameters, particularly where these allow a range of functionalities to be triggered.

##### Best practices for input and output validation include {#bp-input-and-output-validation}

- using a data schema such as [JSON schema](https://json-schema.org) with [schema evolution techniques](https://en.wikipedia.org/wiki/Schema_evolution),
- defining minimum and maximum input sizes and MIME types.

<details class="tools">
  <summary>Tools to support input and output validation</summary>
  <p>The following list is an uncurated selection, alphabetically sorted, and not a specific recommendation</p>
  <ul>
    <li><a href="https://www.npmjs.com/package/ajv">ajv</a></li>
    <li><a href="https://ranger.apache.org">Apache Ranger</a></li>
    <li>In the Apache web-server, control request sizes of different pieces of the request:<ul>
      <li><a href="https://httpd.apache.org/docs/2.4/mod/core.html#limitrequestbody">LimitRequestBody</a></li>
      <li><a href="https://httpd.apache.org/docs/2.4/mod/core.html#limitrequestfields">LimitRequestFields</a></li></ul></li>
    <li>ORM systems exist for almost all programming languages and frameworks, such as<ul>
        <li><a href="https://hibernate.org/orm/documentation/getting-started/">Hibernate</a></li>
        <li><a href="https://www.sqlalchemy.org">SQLAlchemy</a></li>
        <li><a href="https://typeorm.io">TypeORM</a></li> </ul></li>
    <li><a href="https://github.com/validatorjs/validator.js">validatorjs</a></li>
  </ul>
</details>

<div class="info">

##### Risks that input checking can mitigate

* [DOW10](#risk-dow-10)
* [KEC6](#risk-kec-6), [KEC7](#risk-kec-7), [KEC9](#risk-kec-9)
* [HCK1](#risk-hck-1), [HCK2](#risk-hck-2), [HCK3](#risk-hck-3), [HCK4](#risk-hck-4), [HCK5](#risk-hck-5)
</div>
