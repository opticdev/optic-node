# optic-node

NodeJS middlewares for using Optic within [ExpressJS](https://expressjs.com) and [hapi](https://hapi.dev).

# Publishing

In your PR, set the desired version the respective package.json. After merging your PR to the default branch,
tag which package(s) should be published, e.g., `git tag express/v0.0.1 && git push origin main --tags`. The tag
must match the pattern in the corresponding `publish-*.yml` GitHub Action workflow to trigger publishing.
