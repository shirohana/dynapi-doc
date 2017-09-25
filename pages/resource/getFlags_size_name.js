// TODO Fix req.params assignment with complex routeFile
import { join } from 'path'
import { readFileSync } from 'fs'
import nrequire from 'native-require'
import mime from 'mime'

const _require = nrequire.from(process.cwd())

export default async (req, res) => {
  const cache = req.app.get('resource cache')
  const filepath = _require.resolve(join('flag-icon-css', req.path.slice('/resource/'.length)))

  let context = cache.get(filepath)
  if (!context) {
    context = {
      data: readFileSync(filepath, 'utf8'),
      type: mime.getType(filepath)
    }
    cache.set(filepath, context)
  }

  res.type(context.type)
  res.send(context.data)
}
