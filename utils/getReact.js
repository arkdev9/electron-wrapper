require('dotenv').config()
const https = require('https')
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')

const { GITHUB_RELEASE_TOKEN } = process.env

function moveFileUnzip (source, target) {
  fs.rename(source, target, err => {
    if (err) throw err
    console.log(`Moved ${source} to ${target}`)
    const zip = new AdmZip(target)
    // Check if a previous build exists, remove it
    fs.rmdirSync('./build', { recursive: true })
    // Unzip build.zip
    zip.extractAllTo(path.dirname(target), true)
    // Remove build.zip
    fs.unlinkSync(target)
    // Rename ui-build to build
    fs.renameSync(
      path.join(path.dirname(target), 'ui-build'),
      path.join(path.dirname(target), 'build')
    )
  })
}

function download (url, file) {
  https
    .get(
      url,
      {
        headers: {
          Accept: 'application/octet-stream',
          'User-Agent': 'rogueDev9',
          Authorization: `Bearer ${GITHUB_RELEASE_TOKEN}`
        }
      },
      res1 => {
        https
          .get(res1.headers.location, res2 => {
            res2.pipe(file)
            res2.on('error', err => {
              console.log(`Errored -> ${err}`)
            })
            res2.on('end', () => {
              moveFileUnzip(
                path.join(__dirname, 'build.zip'),
                path.join(__dirname, '..', 'build.zip')
              )
            })
          })
          .on('error', err => {
            console.log(`Errored -> ${err}`)
          })
      }
    )
    .on('error', err => {
      console.log(`Errored -> ${err}`)
    })
}

function downloadLatestRelease () {
  https
    .get(
      'https://api.github.com/repos/futuristiclabs/riku-device-ui/releases',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'rogueDev9',
          Authorization: `Bearer ${GITHUB_RELEASE_TOKEN}`
        }
      },
      res => {
        // Pulls the latest release (doesn't distinguish between pre-release and latest)
        let resp = ''
        res.on('data', chunk => {
          resp += chunk
        })
        res.on('end', () => {
          resp = JSON.parse(resp)
          const file = fs.createWriteStream(path.join(__dirname, 'build.zip'))
          console.log(resp)
          download(resp[0].assets[0].url, file)
        })
      }
    )
    .on('error', err => {
      console.log(err)
    })
}

downloadLatestRelease()
