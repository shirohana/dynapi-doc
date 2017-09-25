export default (req, res, next, page) => {
  if (res.locals.links[page]) {
    req.page = page
    res.locals.title = res.locals.links[page]
    res.locals.currentPage = page

    return next()
  } else {
    return next({ status: 404 })
  }
}
