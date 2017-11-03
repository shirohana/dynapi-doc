export const pattern = /^([a-z]{2})(?:-([a-zA-Z]{2}))?$/

export default (req, res, next, lang) => {
  const [language, country] = lang.match(pattern).slice(1)

  const locales = req.app.get('allowed locales')
  const locale = locales[lang] || locales[language]

  if (locale && locale === req.i18n.setLocale(locale)) {
    Object.assign(res.locals, req.i18n.locales[locale])
    req.lang = locale
    res.locals.title = res.locals.homepage

    return next()
  } else {
    // TODO Throw a custom Error after `Custom Error Catcher` completed
    return next(new Error(`Locale (${lang}) not found`))
  }
}
