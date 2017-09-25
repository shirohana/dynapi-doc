export default (req, res, next, chapter) => {
  const { page } = req

  const chapterGroup = Object.values(res.locals[page]).find(chapters => chapters[chapter])

  if (chapterGroup) {
    req.chapter = chapter
    res.locals.title = `${res.locals.title}/${chapterGroup[chapter]}`
    res.locals.currentChapter = chapter

    return next()
  } else {
    return next({ status: 404 })
  }
}
