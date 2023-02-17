import styles from '../page.module.css'
import { StoryblokComponent } from '../../components/StoryblokComponent'
import { getLinks, getStory } from '../../utils/storyblok'
import StoryblokBridge from "../../components/StoryblokBridge";
import { previewData } from "next/headers";

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
  const { props } = await fetchData(params);
  const data = previewData() as {key: string};
  const isPreviewMode = !!data && data.key === 'MY_SECRET_TOKEN';
  const version = process.env.NEXT_PUBLIC_STORYBLOK_VERSION;
  return (
    <main className={styles.container}>
      { isPreviewMode || version === 'draft' ?
          <StoryblokBridge blok={ props.story.content }/> :
          <StoryblokComponent blok={ props.story.content }/>
      }
    </main>
  )
}
