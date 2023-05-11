import styles from './page.module.css'
import { getStory } from '../utils/storyblok'
import StoryblokBridge from "../components/StoryblokBridge";
import { StoryblokComponent } from "../components/StoryblokComponent";
import { draftMode } from 'next/headers';

async function fetchData() {
  const story = await getStory( 'home' );
  return {
    story: story ?? false
  }
}

export default async function Home() {
  const { story } = await fetchData();
  const { isEnabled } = draftMode();
  const version = process.env.NEXT_PUBLIC_STORYBLOK_VERSION;
  console.log(isEnabled)
  return (
    <main className={ styles.container }>
      <div>Preview mode :{JSON.stringify(isEnabled)}</div>
      { isEnabled || version === 'draft' ?
        <StoryblokBridge blok={ story.content }/> :
        <StoryblokComponent blok={ story.content }/>
      }
    </main>
  )
}
