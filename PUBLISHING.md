# Publishing

The package can be automatically [published via CI](#publishing-via-ci) on `tag`, but we have also included helpers to [manually publish](#publishing-manually) via [Task](https://taskfile.dev/#/) commands.

## Publishing via CI

1. Before merging your PR, set the desired version in the respective package.json(s)
2. After merging your PR to the default branch, tag which package(s) should be published, e.g., `git tag express/v0.0.1`. Note the tag must match the pattern in the corresponding `publish-*.yml` GitHub Action workflow to trigger publishing (`sdk/*`, `express/*`, `hapi/*`).
3. Push your tags, `git push origin main --tags`
4. Confirm the GHA completes and the new version is published.

Step 2 & 3 can be simplified using, `task git:tag-and-push -- express/v0.0.1`. Run this once for each tag you intend to create.

## Publishing manually

Note: Consider publishing through CI :)

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

## Removing a tag

```
git tag -d -- <the tag>
git push origin -- :refs/tags/<the tag>
```
