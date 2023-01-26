import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../../models/blok-component.model'
import { SbBlokData, storyblokEditable } from '@storyblok/js'

interface FeatureProps extends SbBlokData {
  name: string
}
const Feature: FunctionComponent<BlokComponentModel<FeatureProps>> = ({
  blok,
}) => {
  return <div {...storyblokEditable(blok)}>
    {blok.name}
  </div>
}

export default Feature
