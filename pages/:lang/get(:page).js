export default (req, res) => {
  const { lang, page } = req

  if (page !== 'news') {
    return res.redirect(`/${lang}`)
  }

  res.render(`locales/${lang}/${page}`)
}
