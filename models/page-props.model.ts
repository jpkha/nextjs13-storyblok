import { ISbStoryData } from 'storyblok-js-client'

export interface PageProps {
  readonly story: ISbStoryData
  readonly key: string
}
