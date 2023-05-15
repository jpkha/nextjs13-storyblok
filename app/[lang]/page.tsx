import { getStory } from "../../utils/storyblok";

import styles from './page.module.css'
import { draftMode } from 'next/headers';
import { StoryblokComponent } from "../../components/StoryblokComponent";
import StoryblokBridge from "../../components/StoryblokBridge";

async function fetchData(lang: string) {
  const story = await getStory( 'home', lang );
  return {
    story: story ?? false
  }
}

export default async function Home({ params: { lang } }: {params: {lang: string}}) {
  const { story } = await fetchData(lang);
  const { isEnabled } = draftMode();
  const version = process.env.NEXT_PUBLIC_STORYBLOK_VERSION;
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
