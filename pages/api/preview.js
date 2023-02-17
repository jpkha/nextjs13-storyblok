export default async function preview(req, res) {
  const { slug = '' } = req.query
  // get the storyblok params for the bridge to work
  const params = req.url.split('?')

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== 'MY_SECRET_TOKEN') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Enable Preview Mode by setting the cookies
  const location = `/${slug}?${params[1]}`
  res.setPreviewData({
    key: req.query.secret,
  })

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie')
  res.setHeader(
    'Set-Cookie',
    cookies.map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    )
  )

  res.writeHead(307, { Location: location })
  res.end()

  // Redirect to the path from entry
  // res.redirect(`/${slug}?${params[1]}`)
}