import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../../models/blok-component.model'
import { SbBlokData, storyblokEditable } from '@storyblok/js'

interface TeaserProps extends SbBlokData {
  headline: string
}

const Teaser: FunctionComponent<BlokComponentModel<TeaserProps>> = ({ blok }) => {
  return <h2 {...storyblokEditable(blok)}>{blok.headline}</h2>
}

export default Teaser
