import { readFileSync } from 'fs'
import nrequire from 'native-require'
import mime from 'mime'

const _require = nrequire.from(process.cwd())

const resources = {
  'bulma.css': { filepath: 'bulma/css/bulma.css' },
  'bulma.css.map': { filepath: 'bulma/css/bulma.css.map' },
  'main.css': { filepath: './dist/main.css', useCache: false },
  'main.css.map': { filepath: './dist/main.css.map', useChche: false },
  'flag-icon.css': { filepath: 'flag-icon-css/css/flag-icon.css' }
}

Object.keys(resources).forEach(key => {
  const { filepath } = resources[key]

  Object.assign(resources[key], {
    type: mime.getType(filepath),
    filepath: _require.resolve(filepath)
  })
})

export default (req, res, next, name) => {
  // TODO Temporary
  if (name === 'highlight.css') {
    try {
      const resource = getHighlightResource(req)
      req.resource = resource

      return next()
    } catch (err) {
      return next(err)
    }
  }

  if (typeof resources[name] === 'undefined') {
    return next({ status: 404 })
  }

  const { type, filepath, useCache } = resources[name]

  try {
    let data

    if (useCache !== false || process.env.NODE_ENV === 'production') {
      const cache = req.app.get('resource cache')
      data = cache.get(filepath)

      if (!data) {
        data = readFileSync(filepath, 'utf8')
        cache.set(filepath, data)
      }
    } else {
      data = readFileSync(filepath, 'utf8')
    }

    req.resource = { type, data }
    return next()
  } catch (err) {
    return next(err)
  }
}

// TODO Use route name from dirname directly
import { join } from 'path'
import glob from 'glob'

const defaultStyle = 'github'

const basedir = join(nrequire.resolve('highlight.js'), '../../styles')
const styles = glob.sync('*.css', { cwd: basedir })

function getHighlightResource (req) {
  const filename = (req.i18n.highlightStyle || defaultStyle) + '.css'

  if (styles.indexOf(filename) < 0) {
    throw { status: 404 }
  }

  const cache = req.app.get('resource cache')
  const filepath = join(basedir, filename)

  let data = cache.get(filepath)

  if (!data) {
    data = readFileSync(filepath, 'utf8')
    cache.set(filepath, data)
  }

  return { type: 'text/css', data }
}
