import { ISbStoryData } from "storyblok-js-client";

export interface BlokComponentModel<T> {
  blok: T
  stories?: ISbStoryData[]
}
