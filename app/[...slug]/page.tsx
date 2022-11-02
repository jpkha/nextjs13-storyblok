import styles from '../page.module.css'
import {getStoryblokApi, StoryblokComponent} from "@storyblok/react";
import {ISbStoriesParams} from "storyblok-js-client/types/interfaces";

export async function generateStaticParams() {
    const storyblokApi = getStoryblokApi();
    let {data} = await storyblokApi.get("cdn/links", {version: "draft"});

    let paths = [];
    Object.keys(data.links).forEach((linkKey) => {
        if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
            return;
        }

        const slug = data.links[linkKey].slug;
        let splittedSlug = slug.split("/");
        paths.push({slug: splittedSlug});
    });

    return paths;
}

async function fetchData(params) {
    let slug = params.slug ? params.slug.join("/") : "home";

    // load the draft version
    let sbParams: ISbStoriesParams = {
        version: "draft", // or 'published'
    };

    const storyblokApi = getStoryblokApi();
    let {data} = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

    return {
        props: {
            story: data ? data.story : false,
            key: data ? data.story.id : false,
        },
    };
}

export default async function Page({params}) {
    const {props} = await fetchData(params);
    // TODO: issue fix useState is not a function or its return value is not iterable
    //const story = useStoryblokState(props.story, {preventClicks: true});
    return (
        <div className={styles.container}>
            <StoryblokComponent blok={props.story.content}/>
        </div>
    )
}
