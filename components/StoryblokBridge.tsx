'use client'
import { loadStoryblokBridge } from '@storyblok/js'

const StoryblokBridge = () => {
  loadStoryblokBridge().then(() => {
    const { StoryblokBridge, location } = window
    const storyblokInstance = new StoryblokBridge()
    storyblokInstance.on(['published', 'change'], () => {
      location.reload()
    })
  })
  return <></>
}

export default StoryblokBridge
