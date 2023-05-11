import { draftMode } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  draftMode().disable();
  return new Response('', {
    status: 307,
    headers: {
      Location: `/${slug}`,
    },
  })
}