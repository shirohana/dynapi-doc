export default (req, res) => {
  const { lang, page, chapter } = req

  return res.redirect(`/${lang}`)

  const renderFile = `locales/${lang}/${page}-${chapter}`
  res.render(renderFile, (err, html) => {
    if (err) {
      return res.send(`Seems '${renderFile}' was not created. Maybe this branch is not completed, yet.`)
    }

    res.send(html)
  })
}
