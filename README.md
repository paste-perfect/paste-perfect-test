# Paste Perfect preview

[Open the test site](https://paste-perfect.github.io/paste-perfect-test/).

This repository is a deployment destination only. `gh-pages` contains the built application; `main` contains this documentation. There are no application dependencies, build scripts or maintenance workflows here.

The [source repository](https://github.com/paste-perfect/paste-perfect) builds and tests `dev`, then deploys the exact successful CI artifact using its existing preview deploy key. It verifies the published commit and runs browser checks after deployment and hourly. All dependency updates, releases and automation belong in the source repository.

Keep GitHub Pages set to **Deploy from a branch → gh-pages → / (root)**. Do not edit generated files. The header and `deployment.json` identify the deployed source commit.

To retry or roll back, use the source repository's [maintenance instructions](https://github.com/paste-perfect/paste-perfect/blob/dev/docs/maintenance.md).
