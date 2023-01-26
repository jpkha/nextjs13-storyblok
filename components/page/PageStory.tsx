import { StoryblokComponent } from '../StoryblokComponent'
import { SbBlokData, storyblokEditable } from '@storyblok/js'
import { FunctionComponent } from "react";
import { BlokComponentModel } from "../../models/blok-component.model";

interface PageStoryProps extends SbBlokData{
  body: SbBlokData[]
}
const PageStory: FunctionComponent<BlokComponentModel<PageStoryProps>> = ({ blok }) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
}

export default PageStory
