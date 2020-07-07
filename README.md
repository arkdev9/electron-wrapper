# Riku - Electron on Device

Simple wrapper around [riku-device-ui](https://github.com/futuristiclabs/riku-device-ui) that allows access to system level functions.

## Required Metadata

In `package.json`

- `author` - Required to build linux distributables (**required**)
- `build` - Configuration required by `electron-builder` to build distributable
  - `files` - List of directories and files required to be packaged into the Electron app during build

## Scripts

- `yarn pull-ui` - Uses Node to get latest release of `riku-device-ui` from GitHub releases and places it at root of project directory
- `yarn build` - Pulls UI using `yarn pull-ui` and builds the current Electron app targeting the architecture of the host system
- `yarn release` - Required by GitHub Actions to draft a release on repository releases
- `yarn postinstall` - Makes sure app dependencies are installed after app is built (used by electron-builder)

## GH Actions

Required env variables

- `GH_TOKEN` - Required personal access token that has the `repo` scope. (GITHUB_TOKEN provided by GitHub Actions doesn't have the required scope)
- `NODE_ENV` - Either `development` or `production` 

### Testing Locally

You can test new workflows locally with [nektos/act](https://github.com/nektos/act). It requires docker to run. After installing Docker, change directory to project and run `act -l` to see the the workflows defined in the local repository, and simply run `act` start the workflow.

## TODO

- [ ] Implement switching from local build directory to webpack-dev server depending on `NODE_ENV`
- [ ] Write tests using Spectron
- [ ] Test Electron deb build on Raspbian
- [ ] Test MQTT with Electron build