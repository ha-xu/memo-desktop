# Release Guide

This project builds Windows x64 installers. Releases are triggered by version tags and use GitHub Actions authentication; no ChatGPT account connection or personal access token is required.

## Initial repository setup

After pushing the project to your GitHub repository:

1. Confirm that Actions workflows are enabled. CI runs on pull requests, pushes to `main` / `master`, and manual dispatch. If your default branch has another name, update the branch list in `ci.yml`.
2. Consider protecting the default branch and requiring a pull request and successful `Windows checks` before merging. Restrict creation of `v*` tags to maintainers.
3. Enable **Private vulnerability reporting** in the repository Security settings to provide the reporting channel described in `SECURITY.md`.
4. Check whether your organization allows the publishing job to request `contents: write`. The workflow uses the automatically provided `GITHUB_TOKEN`; no additional secret is needed.
5. Wait for the first successful CI run and inspect its installer and UI screenshots under Actions Artifacts.

Actions are pinned to full commit hashes. Dependabot checks npm dependencies and Actions weekly. Verify the official source and release notes when updating an Action.

## Routine pull requests

The pull request and default-branch workflow runs:

```text
npm ci → npm test → npm run build → npm run runtime
       → npm run check:i18n → npm run check:dpi → npm run package:win
```

Successful runs upload the installer and blockmap for 14 days. Screenshots from isolated UI checks are retained for 7 days. Pull requests do not create Releases, have read-only repository permissions, and do not execute contributor code through `pull_request_target`.

CI checks DPI behavior on the Windows runner’s virtual display. Before releasing changes to display behavior, also test on real monitors with different scale factors.

## Prepare a version

1. Confirm that the intended commit passes CI. Exit any running development instance and back up the data used for manual testing.
2. Choose a semantic version: a patch for fixes, such as `1.2.1`; a minor version for compatible features; or a major version for breaking changes. A prerelease can use a version such as `1.3.0-beta.1`. The commands below use `1.2.1` as an example; replace it with your intended new version.
3. Update `package.json` and `package-lock.json` without creating a Git tag:

   ```powershell
   npm version 1.2.1 --no-git-tag-version
   ```

4. Move the relevant `Unreleased` entries in `CHANGELOG.md` into a section named `## [1.2.1] - YYYY-MM-DD`. Keep an empty `Unreleased` section. The version must match the package files, and the release section must include at least one change.
5. Update any hardcoded version fallback in the sidebar. The desktop application reports its version through `app.getVersion()`.
6. Run and inspect:

   ```powershell
   npm test
   npm run build
   npm run runtime
   npm run check:i18n
   npm run check:dpi
   npm run release:check
   npm run package:win
   npm run release:prepare
   ```

   `release:prepare` only prepares local files; it does not upload anything. It stages the installer, blockmap, `SHA256SUMS.txt`, and `release-notes.md` in `work/release-assets`. If that directory contains files from another version or unexpected files, the script refuses to mix them into the release. Retry from a clean checkout.

7. Commit and merge the version-preparation PR, then create a tag from that commit. For example:

   ```powershell
   git switch main
   git pull --ff-only
   git tag -a v1.2.1 -m "Memo Desktop 1.2.1"
   git push origin v1.2.1
   ```

Do not move published version tags. Use a new version number to correct a published release. Your local repository must already be initialized and connected to the intended remote before pushing.

## Automated publishing

`release.yml` listens only for `v*` tags:

1. The Windows build job verifies that the tag equals `v<package.json.version>`, the lockfile versions match, and the corresponding changelog section can be extracted.
2. It runs the same tests, UI checks, and DPI checks, then builds the Windows installer. electron-builder uses `--publish never`, so building does not implicitly upload files.
3. It stages only the installer and blockmap matching that version, generates SHA-256 checksums, and extracts release notes from the changelog.
4. A separate publishing job downloads artifacts from the same workflow run and verifies their hashes. It does not check out source code, install dependencies, or execute project scripts.
5. GitHub CLI creates a draft and uploads all assets before making the Release public. Prerelease versions are marked as Pre-release.

The publishing job requests `contents: write`. Pushing an allowed version tag authorizes publication of that version; no additional manual approval is configured. If you want an approval step, add GitHub Environment protection rules to that job.

Each public Release contains:

- `Memo Desktop Setup <version>.exe`
- `Memo Desktop Setup <version>.exe.blockmap`
- `SHA256SUMS.txt`

The blockmap is distributed with the installer, but the application does not currently implement automatic updates. Publishing a Release does not add in-app updating.

## Failures and retries

- **Tag or changelog mismatch:** correct the version files or changelog and create the appropriate new tag.
- **Tests or packaging fail:** no public Release is created. Inspect the failing step and UI screenshots, fix the issue, and use a new version.
- **An upload failure leaves a draft:** rerun the workflow. Only draft assets may be overwritten; the Release becomes public after all uploads complete.
- **The version is already public:** the workflow refuses to overwrite it. Use a new version number.
- **403 permission errors:** check repository or organization Actions policies. Do not grant writable tokens to ordinary PR workflows.
- **Code signing:** installers are currently unsigned. If you add signing later, store certificates and passwords in GitHub Secrets and update the electron-builder signing configuration. Never commit certificates or passwords.

## References

- [GitHub Actions GITHUB_TOKEN permissions](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)
- [Creating a Release with GitHub CLI](https://cli.github.com/manual/gh_release_create)
- [electron-builder publishing configuration](https://www.electron.build/docs/publish/)
