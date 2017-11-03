const production = process.env.NODE_ENV === 'production'

if (!production) {
  process.env.DEBUG = 'api:*'
}

const port = process.env.PORT || 4000

const express = require('express')
const dynapi = require('dynapi')
const i18n = require('i18n-2')
const cpx = require('cpx')
const rimraf = require('rimraf')
const glob = require('glob')
const lru = require('lru-cache')

// Clean up
rimraf.sync('i18n')
cpx.copySync('locales/*.json', 'i18n')

if (!production) {
  watchLocales() // Copy files to prevent translation lost after JSON.stringify
  watchStylus() // Build global style `style/stylus/index.styl > dist/style.css`
  // watchBulma() // Build customized Bulma
}

const locales = glob.sync('*.json', { cwd: 'locales' }).map(v => v.slice(0, -5))
const app = express()

app.disable('x-powered-by')

app.set('trust proxy', 'loopback')

app.set('views', 'views')
app.set('view engine', 'pug')
app.set('allowed locales', locales.reduce((obj, locale) => {
  obj[locale] = locale
  return obj
}, {}))
app.set('resource cache', lru({
  maxAge: 10 * 60 * 1000
}))

i18n.expressBind(app, {
  locales,
  directory: 'i18n',
  extension: '.json',
  devMode: !production
})

app.use('/', dynapi({
  routesDir: 'pages',
  aliases: [
    'utils/index.js'
  ]
}))

app.listen(port, () => {
  console.log(`Server starts on http://127.0.0.1:${port}`)
})

function watchLocales () {
  cpx.watch('locales/*.json', 'i18n', { initialCopy: false })
}

function watchStylus () {
  const args = 'style/stylus/index.styl -o dist/main.css --sourcemap -w'.split(' ')
  const proc = require('child_process').spawn('stylus', args, { stdio: 'inherit' })
}

function watchBulma () {
  const args = 'style/bulma.sass dist/bulma.css --source-map dist/bulma.css.map -w'.split(' ')
  const proc = require('child_process').spawn('node-sass', args, { stdio: 'inherit' })
}
