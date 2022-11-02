import {FunctionComponent} from "react";
import {BlokComponentModel} from "../../models/blok-component.model";
import {SbBlokData} from "@storyblok/js";

interface TeaserProps extends SbBlokData {
  headline: string;
}
const Teaser: FunctionComponent<BlokComponentModel<TeaserProps>> = ({ blok }) => {
  return <h2>{blok.headline}</h2>;
};

export default Teaser;
