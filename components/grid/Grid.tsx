import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {SbBlokData} from "@storyblok/js";
import {FunctionComponent} from "react";
import {BlokComponentModel} from "../../models/blok-component.model";
import styles from "../../styles/Home.module.css";

interface GridProps extends SbBlokData{
  columns: SbBlokData[]
}
const Grid: FunctionComponent<BlokComponentModel<GridProps>>  = ({ blok }) => {
  return (
    <div className={styles.grid} {...storyblokEditable(blok)}>
      {blok.columns.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Grid;
