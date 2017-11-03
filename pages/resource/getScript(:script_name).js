export default (req, res) => {
  const { type, data } = req.resource

  res.type(type)
  res.send(data)
}
