import { StoryData } from "storyblok-js-client";

export interface PageProps {
    readonly story: StoryData;
    readonly key: string;
}