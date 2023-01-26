import styles from './page.module.css'
import { getStory } from '../utils/storyblok'
import { StoryblokComponent } from '../components/StoryblokComponent'

async function fetchData() {
  const story = await getStory('home')
  return {
    props: {
      story: story ?? false,
    },
  }
}
export default async function Home() {
  const { props } = await fetchData()
  return (
    <main className={styles.container}>
      <StoryblokComponent blok={props.story.content} />
    </main>
  )
}
