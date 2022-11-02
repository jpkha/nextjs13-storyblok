import styles from './page.module.css'
import {getStoryblokApi, StoryblokComponent} from "@storyblok/react";
import {ISbStoriesParams} from "storyblok-js-client/types/interfaces";

async function fetchData() {
  let slug = "home";

  // load the draft version
  let sbParams: ISbStoriesParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    },
  };
}
export default async function Home() {
  const {props} = await fetchData();
  // TODO: issue fix useState is not a function or its return value is not iterable
  //const story = useStoryblokState(props.story, {preventClicks: true});
  return (
    <div className={styles.container}>
      <StoryblokComponent blok={props.story.content} />
    </div>
  )
}
