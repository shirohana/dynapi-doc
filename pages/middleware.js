import { dirname } from 'path'
import { highlight, markdown } from '~/utils'

let basedir = null

export default (req, res, next) => {
  res.set({
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': 'block-all-mixed-content'
  })

  // Pug basedir
  res.locals.basedir = basedir || (basedir = req.app.get('views'))

  // Inject all languages
  res.locals.availableLanguages = Object.values(req.i18n.locales).map(locale => ({
    icon: locale.flagIcon,
    name: locale.languageName,
    link: locale.lang
  }))

  res.locals.filters = res.locals.filters || {}

  // TODO Linkify these tags
  const tags = {
    'Route': '<span class="tags has-addons"><span class="tag is-dark">Ro</span><span class="tag">Route</span></span>',
    'ParamRoute': '<span class="tags has-addons"><span class="tag is-dark">P-Ro</span><span class="tag">ParamRoute</span></span>',
    'Responser': '<span class="tags has-addons"><span class="tag is-success">R</span><span class="tag">Responser</span></span>',
    'Middleware': '<span class="tags has-addons"><span class="tag is-info">M</span><span class="tag">Middleware</span></span>',
    'Parameter': '<span class="tags has-addons"><span class="tag is-warning">P</span><span class="tag">Parameter</span></span>',
    'Catcher': '<span class="tags has-addons"><span class="tag is-danger">C</span><span class="tag">Catcher</span></span>',
    '-Route': '<span class="tag">Route</span>',
    '-ParamRoute': '<span class="tag">ParamRoute</span>',
    '-Responser': '<span class="tag">Responser</span>',
    '-Middleware': '<span class="tag">Middleware</span>',
    '-Parameter': '<span class="tag">Parameter</span>',
    '-Catcher': '<span class="tag">Catcher</span>>'
  }

  Object.assign(res.locals.filters, {
    highlight,
    markdown: (text, options) => {
      // Replace ${variable} -> res.locals[variable]
      text = text.replace(/\\?\${(\w+)}/g, (text, key) => {
        if (text[0] === '\\') {
          return text.slice(1)
        } else {
          return res.locals[key]
        }
      })

      // Replace {Responser} -> tags[Responser]
      text = text.replace(/\\?{(-?[a-zA-Z]+)}/g, (text, key) => {
        if (text[0] === '\\') {
          return text.slice(1)
        } else {
          return tags[key] || text
        }
      })

      return markdown(text, options)
    }
  })

  return next()
}
