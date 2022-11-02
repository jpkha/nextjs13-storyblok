import {SbBlokData} from "@storyblok/js";
import {FunctionComponent} from "react";
import {BlokComponentModel} from "../../models/blok-component.model";
import styles from "../../styles/Home.module.css";
import { StoryblokComponent } from "../StoryblokComponent";
import Feature from "../feature/Feature";

interface GridProps extends SbBlokData{
  columns: SbBlokData[]
}
const Grid: FunctionComponent<BlokComponentModel<GridProps>>  = ({ blok }) => {
  return (
    <div className={styles.grid}>
      {blok.columns.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} />
      ))}
    </div>
  );
};

export default Grid;
