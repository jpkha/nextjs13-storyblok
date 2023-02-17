import styles from './page.module.css'
import { getStory } from '../utils/storyblok'
import { previewData } from "next/headers";
import StoryblokBridge from "../components/StoryblokBridge";
import { StoryblokComponent } from "../components/StoryblokComponent";

async function fetchData() {
    const story = await getStory( 'home' )
    return {
        props: {
            story: story ?? false,
        },
    }
}

export default async function Home() {
    const { props } = await fetchData();
    const data = previewData() as {key: string};
    const isPreviewMode = !!data && data.key === 'MY_SECRET_TOKEN';
    const version = 'draft';
    return (
        <main className={ styles.container }>
            { isPreviewMode || version === 'draft' ?
                    <StoryblokBridge blok={ props.story.content }/> :
                    <StoryblokComponent blok={ props.story.content }/>
            }
        </main>
    )
}
