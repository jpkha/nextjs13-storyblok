import { SbBlokData, storyblokEditable } from '@storyblok/js'
import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../../models/blok-component.model'
import styles from '../../styles/Home.module.css'
import { StoryblokComponent } from '../StoryblokComponent'

interface GridProps extends SbBlokData {
  columns: SbBlokData[]
}
const Grid: FunctionComponent<BlokComponentModel<GridProps>> = ({ blok }) => {
  return (
    <div className={styles.grid} {...storyblokEditable(blok)}>
      {blok.columns.map((nestedBlok) => (
        <StoryblokComponent key={nestedBlok._uid} blok={nestedBlok} />
      ))}
    </div>
  )
}

export default Grid
