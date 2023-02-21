import React, { FunctionComponent } from 'react'
import { ComponentsMap } from './components-list'
import { SbBlokData } from '@storyblok/js'

interface StoryblokComponentProps {
  blok: SbBlokData
  [key: string]: unknown
}

export const StoryblokComponent: FunctionComponent<StoryblokComponentProps> = ({ blok, ...restProps }) => {
  if (!blok) {
    console.error("Please provide a 'blok' property to the StoryblokComponent")
    return <div>Please provide a blok property to the StoryblokComponent</div>
  }
  if(blok.component) {
    const Component = getComponent(blok.component)
    if (Component) {
      return <Component blok={blok} {...restProps} />
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
