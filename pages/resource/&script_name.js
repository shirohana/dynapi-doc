import { readFileSync } from 'fs'
import nrequire from 'native-require'
import mime from 'mime'

const _require = nrequire.from(process.cwd())

const resources = {
  'main.js': { filepath: './script/main.js' }
}

Object.keys(resources).forEach(key => {
  const { filepath } = resources[key]

  Object.assign(resources[key], {
    type: mime.getType(filepath),
    filepath: _require.resolve(filepath)
  })
})

export default (req, res, next, name) => {
  if (typeof resources[name] === 'undefined') {
    return next({ status: 404 })
  }

  const cache = req.app.get('resource cache')
  const { type, filepath, useCache } = resources[name]

  try {
    let data

    if (useCache || process.env.NODE_ENV === 'production') {
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
