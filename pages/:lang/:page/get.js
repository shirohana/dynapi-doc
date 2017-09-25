export default (req, res) => {
  const { lang, page } = req

  res.render(`locales/${lang}/${page}`)
}
