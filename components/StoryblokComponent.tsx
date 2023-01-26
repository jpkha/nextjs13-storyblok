
import React, { forwardRef } from 'react'
import { ComponentsMap } from './components-list'
import { SbBlokData } from '@storyblok/js'

interface StoryblokComponentProps {
  blok: SbBlokData
  [key: string]: unknown
}

// @ts-ignore
export function StoryblokComponent({ blok, ...restProps }, ref): forwardRef<
    HTMLElement,
    StoryblokComponentProps
> {
  if (!blok) {
    console.error("Please provide a 'blok' property to the StoryblokComponent")
    return <div>Please provide a blok property to the StoryblokComponent</div>
  }
  if(blok.component) {
    // @ts-ignore
    const Component = getComponent(blok.component)
    if (Component) {
      // @ts-ignore
      return <Component ref={ref} blok={blok} {...restProps} />
    }
  }
  return <></>
}

const getComponent = (componentKey: string) => {
  // @ts-ignore
  if (!ComponentsMap[componentKey]) {
    console.error(`Component ${componentKey} doesn't exist.`)
    return false
  }
// @ts-ignore
  return ComponentsMap[componentKey]
}
