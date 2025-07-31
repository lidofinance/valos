# Providing Feedback

Your feedback is important to help us improve the Validator Operator Specification (ValOS). We are grateful for and would like to acknowledge contributions, but there are some important points to consider when providing them.

##  Terms and Conditions

BY CONTRIBUTING TO THIS REPOSITORY, YOU AGREE:

1. THAT THE CONTRIBUTIONS ARE YOUR OWN WORK OR WORK YOU HAVE PERMISSION TO SHARE UNDER THESE TERMS OF CONTRIBUTION, AND
2. TO PROVIDE YOUR CONTRIBUTIONS UNDER THE TERMS OF THE [APACHE 2.0 LICENSE](LICENSE.md), AND
3. TO PROVIDE LIDO FINANCE, IN EXCHANGE FOR THEIR CONTRIBUTION TO THE MAINTENANCE OF THIS WORK, A NON-EXCLUSIVE WORLDWIDE IRREVOCABLE LICENSE TO IMPLEMENT, PERFORM, COPY, MODIFY DISTRIBUTE ADN OTHERWISE USE YOUR CONTRIBUTIONS, WHETHER COMMERCIALLY OR OTHERWISE, AS THEY CHOOSE IN THEIR SOLE DISCRETION.

The [**current update draft**](spec-update-draft.md) is the latest development state of the proposal for a new version.
Please provide feedback based on that document.

## What

### What feedback is useful?

Simple fixes such as correcting broken links, typos, and the like are welcome and appreciated.

If you are looking for something to contribute on, please consider the items labeled
"[Good First Issue](https://github.com/lidofinance/valos/good%20first%20issue)", or
"[Help Wanted](https://github.com/lidofinance/valos/labels/help%20wanted)".

If there is something that you think could and should be improved, please tell us.
Importantly, this should include explaining why something doesn't work as well as it could -
for example explaining the situation where it causes a problem, or doesn't resolve a doubt.

It is not necessary to propose a solution to the problem, although you are [welcome to do so](#how-to-propose-a-solution).

### What feedback is NOT useful?

Not all feedback is helpful.
While it is nice if people think we are doing a great job, the best way to do that is to talk about the work in other places,
to use it, and to say that you are using it.

Please refrain from including personal details, or Personally Identifying Information, beyond a name to be acknowledged as a contributor, in your feedback.
Racist, sexist, and other such anti-social content or behaviour will not be tolerated, and will generally lead to your exclusion from this work.

## How

### How to provide feedback?

The core mechanism to provide feedback is comments on issues. Please look for an [existing issue](https://github.com/lidofinance/valos/issues)
or issue in the [old repository of issues](https://github.com/LionscraftTeam/DUCK-Knowledge-Base/issues) that covers the topic you wish to discuss,
and if there is one, please add a comment there, rather than opening a new issue.

If the issue has been closed, it means this has been considered. While it is possible to re-open it,
that is less likely to happen unless there is new information provided:
a change in the general situation (including a general shift in community opinion), a new approach to dealing with it that hasn't been considered, or the like.
So it may be that your comment doesn't result in re-opening, but that it in turn attracts more comment that does mean we re-examine the question.

If no existing issue covers your topic, please do raise a new issue.

### How to propose a solution?

**By making the contribution you accept the [conditions of contributing](#terms-and-conditions)**.

You can describe the proposed changes in an Issue comment. The Editor (or someone else who wants to) can convert this to a Pull Request, as long as the explanation is clear enough.

Please understand that as we have a community governance model, all such proposals will be discussed rather than automatically adopted, as they may impact other users in different ways.
This discussion can lead to changes, or even not adopting the proposed solution, especially if it is not clear to other people in those discussions what problem the proposal is solving.

You can also make a Pull Request. If you do:

- Please work on a temporary branch and make a Pull Request against the `staging` branch, which is the working branch for the next replacement version.
  If it is a typo or other fix that should also be taken into the existing DUCK v1, the editorial team will cherry-pick it.
- Please provide the name you wish to be acknowledged by, if you are not already an acknowledged contributor.
- In general, smaller Pull Requests that each address one issue are preferable to a single large Pull Request that touches multiple parts of the document.
  This is because unless a large Pull request is adopted very quickly, it complicates the development of all other Pull Requests while it is pending.
- It is helpful if you manage to follow all the editorial conventions, provide links, etc.

All Pull Requests will be reviewed and edited as necessary, so feel free to make a proposal and know that your contribution is appreciated
even if you do not have time to understand and replicate the various conventions of the existing source code.

## What happens next?

Issues and Pull Requests are assigned at least one milestone, which refers to a decision point at which they can be approved, or returned for more discussion.

Items on the milestone will be published to the Telegram Community on Fridays. If there is no objection raised, they will be merged into the `staging` brnch, or closed as proposed, on the following Wednesday.

When all the approved items have been merged into the staging branch, a Pull Request will be raised to merge that update to the `main` branch.

