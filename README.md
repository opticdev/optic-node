# optic-node

NodeJS middlewares for using Optic within [ExpressJS](https://expressjs.com) and [hapi](https://hapi.dev).

# Publishing via CI

1. Before merging your PR set the desired version in the respective package.json(s)
1. After merging your PR to the default branch, tag which package(s) should be published, e.g., `git tag express/v0.0.1`. Note the tag must match the pattern in the corresponding `publish-*.yml` GitHub Action workflow to trigger publishing (`sdk/*`, `express/*`, `hapi/*`)
1. Push your tags, `git push origin main --tags`
1. Confirm the GHA completes and the new version is published.

Note: The above is currently broken, see https://github.com/opticdev/optic-node/issues/9. For now, stick to the manual publishing steps.

# Publishing manually

0. Have an NPM publish token for the packages to publish
0. Before merging your PR set the desired version in the respective package.json(s)
0. After merging, run the task(s) for the packages to publish,
    ```
    ➜ task -l | grep publish
    * express:publish:      Publish @useoptic/express-middleware
    * hapi:publish:         Publish @useoptic/hapi-middleware
    * sdk:publish:          Publish @useoptic/optic-node-sdk
    ```
    By default, the publish task will default to DRY_RUN=true and display the package and version that would be published.
