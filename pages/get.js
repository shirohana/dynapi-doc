export default (req, res) => {
  const locales = req.app.get('allowed locales')
  const locale = req.acceptsLanguages().find(lang => locales[lang])

  res.redirect(`/${locale || req.i18n.defaultLocale}`)
}
