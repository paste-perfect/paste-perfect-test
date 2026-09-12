# Paste Perfect test environment

The preview of [Paste Perfect](https://github.com/paste-perfect/paste-perfect) is published at <https://paste-perfect.github.io/paste-perfect-test/>.

`main` contains the environment checks and operating instructions. `gh-pages` contains generated files only. GitHub Pages serves the root of `gh-pages`; do not edit generated bundles or store workflows on that branch.

Every successful source-repository CI run on `dev` produces a preview artifact. The source delivery workflow verifies its commit metadata and publishes that exact artifact here using `DEPLOY_KEY_PREVIEW`. A maintenance change does not need a semantic release to reach test.

The scheduled verification checks the deployed commit, base path and referenced assets, then runs browser smoke tests from that exact source revision. It also runs after a Pages build and can be started manually. Failed deployment checks remain visible in Actions; they never modify or promote source code.

## Setup

- Set this repository's default branch to `main` after merging the configuration PR.
- Keep Pages configured to deploy from `gh-pages` at `/`.
- Keep the existing preview deploy key restricted to this repository.
- Require `Environment configuration` on PRs into `main`; forbid deletion and force pushes to `main`.
- The workflows use the built-in token with read access. No additional secrets are needed.

## Verification and recovery

Run `node --test scripts/*.test.mjs` with Node 24 to check the validation logic locally. Run `node scripts/verify-deployment.mjs` to check the published site.

`deployment.json` records the source SHA and target. Follow that SHA in the source repository to inspect CI and the change that was deployed. The application header displays its short SHA so preview and production are identifiable without release-generated commits.

If deployment fails, rerun the source delivery job for the latest successful `dev` CI run. Superseded commits are intentionally ignored. To roll back, revert the source change through a PR into `dev`; the normal validation and deployment path publishes the revert.
