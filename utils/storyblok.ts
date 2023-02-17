import { storyblokInit, apiPlugin } from '@storyblok/js'

const storyblokToken = process.env.STORYBLOK_TOKEN;

const { storyblokApi } = storyblokInit({
  accessToken: storyblokToken,
  bridge: true,
  apiOptions: {
    cache: { type: 'memory' },
  },
  use: [apiPlugin],
})

export async function getLinks() {
  if(!storyblokApi) {
    return ;
  }
  const { data } = await storyblokApi.get('cdn/links', {
    version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION as 'draft' | 'published',
  })
  const links = data ? data.links : null
  return links
}

export async function getStory(slug: string) {
  if(!storyblokApi) {
    return ;
  }
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION as 'draft' | 'published',
  })
  const story = data ? data.story : null
  return story
}
