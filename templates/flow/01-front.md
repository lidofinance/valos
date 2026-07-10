Copyright© 2026, Lido Labs Foundation. This document may be used, modified, copied and distributed under the terms of the [Apache 2 License](./LICENSE).



<section id="abstract">

<h2>Abstract</h2>

This specification defines risks that can apply when operating a blockchain node.

It describes mitigations that can minimize the likelihood that particular risks will be realized and cause a problem,
such as compromising the ability to manage a node or actions that result in reduced economic rewards, or penalties such as slashing.

Finally, it provides a set of controls to verify that a Node Operator is appropriately managing the relevant risks.

</section>

## Introduction {#sec-introduction}

### Purpose {#sec-purpose}

This specification builds on the [DUCK knowledge base](https://duck-initiative.gitbook.io/d.u.c.k.-knowledge-base) [[?DUCK]].
The risk framework and explanation of mitigation strategies have been updated, based on feedback from practitioners.
A specific set of controls has been added; statements of requirement that can be tested,
to ensure that as far as possible a Node Operator is following the recognized best practices to minimize risk and effectively maximize their returns.

While other standards such as AICPA's SOC 2® [[?SOC2]] or ISO's 27001 standard [[?ISO27001]] can be applied to Node Operators,
they often include more general requirements than this specification, reflecting a broader scope.

The relevant controls from several such standards are explicitly linked to the controls in this specification. The purpose of this is twofold:
to simplify the process of certifying conformance to this specification for Operators who have already undergone testing against those standards,
and to simplify the process of assessing Node Operators who have been certified as conforming to this specification against those specifications.

<section id="conformance">

Conformance to this specification is based on meeting the requirements expressed in the [Controls Catalog](#sec-controls-catalog).
</section>
