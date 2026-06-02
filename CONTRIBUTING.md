# Providing Feedback

Your feedback is important to help us improve the Validator Operations Standard (ValOS). We are grateful for and would like to acknowledge contributions, but there are some important points to consider when providing them.

## Terms and Conditions

BY CONTRIBUTING TO THIS REPOSITORY, YOU AGREE:

1. THAT THE CONTRIBUTIONS ARE YOUR OWN WORK OR WORK YOU HAVE PERMISSION TO SHARE UNDER THESE TERMS OF CONTRIBUTION, AND
2. TO PROVIDE YOUR CONTRIBUTIONS UNDER THE TERMS OF THE [APACHE 2.0 LICENSE](LICENSE), AND
3. TO PROVIDE LIDO LABS FOUNDATION, IN EXCHANGE FOR THEIR CONTRIBUTION TO THE MAINTENANCE OF THIS WORK, A NON-EXCLUSIVE WORLDWIDE IRREVOCABLE LICENSE TO IMPLEMENT, PERFORM, COPY, MODIFY DISTRIBUTE AND OTHERWISE USE YOUR CONTRIBUTIONS, WHETHER COMMERCIALLY OR OTHERWISE, AS THEY CHOOSE IN THEIR SOLE DISCRETION.

The version of [**current update draft**](valos-spec.html)
in the [`advance-staging` branch](https://github.com/lidofinance/valos/tree/advance-staging) is the latest development state of the proposal for a new version,
incorporating changes that are proposed but not necessarily agreed.

Please provide feedback based on that document.

(**NB** To read the latest draft, clone the repository, check out the `advance-staging` branch, run `npm ci`, then open `valos-spec.html` in a browser via a local HTTP server. See [Local preview](#local-preview) below.)

## What

### What feedback is useful?

Simple fixes such as correcting broken links, typos, and the like are welcome and appreciated.

If you are looking for something to contribute on, please consider the items labeled
"[Good First Issue](https://github.com/lidofinance/valos/labels/good%20first%20issue)", or
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

### Local preview

The spec source (`valos-spec.html`) uses [ReSpec](https://respec.org/) to render. ReSpec is installed via `npm`; you need it on your machine to preview the spec locally.

**Requirements:** Node.js **>= 24** (ReSpec 37 requires it) and `npm`.

**One-time setup after cloning:**

```sh
npm ci
```

This installs ReSpec into `node_modules/`. Without this step, opening `valos-spec.html` in a browser will not render correctly.

**Two preview modes:**

- *Quick edit & preview* — run `npm run draft`. ReSpec renders `valos-spec.html` in your browser at view time and the page reloads automatically when you save edits to the source. **This mode renders in your own browser and needs no Chrome/Puppeteer setup** — it is all most contributors editing prose ever need.
- *Preview the deployed artifact* — run `npm run preview` to build `dist/valos-spec.html` and open it in your browser. This is the exact file that is published. Recommended before opening a PR if you have changed structural elements or other render-time behavior. This mode runs the full build (below), which renders via headless Chrome and **does** require the extra setup.

The deployed artifact is built by [`scripts/build.mjs`](scripts/build.mjs) and the `.github/workflows/deploy.yml` workflow.

### Building the deployed artifact locally (`npm run build` / `npm run preview`)

The build renders the spec through the ReSpec CLI, which drives a **headless Chrome via Puppeteer**. `npm ci` installs `puppeteer-core` but **does not download a browser**, and minimal Linux/WSL environments lack Chrome's runtime libraries — so the first build typically needs two extra one-time steps. (macOS and Windows usually work after just the Chrome download.)

**1. Install the Chrome build Puppeteer expects.** Run the build once: if it fails with `Could not find Chrome (ver. X)`, install that exact version into Puppeteer's cache:

```sh
npx @puppeteer/browsers install chrome@<X> --path ~/.cache/puppeteer
```

Substitute the version from the error message (e.g. `chrome@148.0.7778.97`). Do **not** use bare `npx puppeteer browsers install chrome` — it installs whatever version the latest `puppeteer` pins, which may not match what ReSpec's `puppeteer-core` looks for.

**2. (Linux/WSL only) Install Chrome's system libraries.** If the build then fails with `error while loading shared libraries: libnspr4.so` (or similar), install the shared objects Chrome needs:

```sh
sudo apt-get update
sudo apt-get install -y libnspr4 libnss3 libdbus-1-3 libatk1.0-0 \
  libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 \
  libatspi2.0-0
sudo apt-get install -y libasound2t64 || sudo apt-get install -y libasound2
```

(`libasound2t64` on Ubuntu 24+, `libasound2` on older releases.)

**3. (Ubuntu 24+ / WSL only) Chrome sandbox.** Ubuntu 24's AppArmor blocks the unprivileged user namespace Chrome's sandbox needs, so the launch fails with `No usable sandbox!` / a browser-process crash. Run the render under the system Chrome AppArmor profile:

```sh
aa-exec --profile=chrome npx respec \
  --src=valos-spec.html --out=dist/valos-spec.html --localhost --haltonerror
```

`scripts/build.mjs` applies this `aa-exec` wrapper automatically on Linux when `aa-exec` is available (`sudo apt-get install -y apparmor-utils` to provide it), so `npm run build` works once the profile is installed; the same wrapper keeps CI green.

### Commit Signing

Core team members **must** sign commits with GPG. For external contributors:

- Signed commits are appreciated but not required
- We will review your code and sign commits on merge using squash-and-merge
- If you'd like to sign your commits, see [GitHub's commit signature verification guide](https://docs.github.com/en/authentication/managing-commit-signature-verification)

## What happens next?

Issues and Pull Requests are likely to begin being reflected in a draft update in the second half of 2026.

When all the approved items have been merged into the staging branch, the update will be checked then merged to the `main` branch.
