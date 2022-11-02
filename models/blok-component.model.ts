import { StoryData } from "storyblok-js-client";

export interface BlokComponentModel<T> {
  blok: T,
  stories?: StoryData[]
}