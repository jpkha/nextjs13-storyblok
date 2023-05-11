// route handler with secret and slug
import { draftMode, cookies } from 'next/headers'

export async function GET(request) {
  'use server'
  // Parse query string parameters
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.DRAFT_SECRET_TOKEN) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable Draft Mode by setting the cookie
  draftMode().enable()
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().set(cookie.name, cookie.value, {
        sameSite: 'None',
        secure: true,
      })
    })

  // Redirect to the path from the fetched post
  return new Response('', {
    status: 307,
    headers: {
      Location: `/${slug}`,
    },
  })
}
