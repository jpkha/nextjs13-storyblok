import styles from '../page.module.css'
import { StoryblokComponent } from '../../components/StoryblokComponent'
import { getLinks, getStory } from '../../utils/storyblok'

interface Paths {
  slug: string[]
}
export async function generateStaticParams() {
  const links = await getLinks()
  const paths: Paths[] = [];
  Object.keys(links).forEach((linkKey) => {
    if (links[linkKey].is_folder || links[linkKey].slug === 'home') {
      return
    }

    const slug = links[linkKey].slug
    let splittedSlug = slug.split('/')
    paths.push({ slug: splittedSlug })
  })

  return paths
}

async function fetchData(params: Paths) {
  let slug = params.slug ? params.slug.join('/') : 'home'

  const story = await getStory(slug)
  return {
    props: {
      story: story ?? false,
    },
  }
}

export default async function Page({ params } : {params: Paths}) {
  const { props } = await fetchData(params)
  return (
    <main className={styles.container}>
      <StoryblokComponent blok={props.story.content} />
    </main>
  )
}
