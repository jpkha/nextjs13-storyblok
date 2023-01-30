<div align="center">
	<h1 align="center">@Jpkha/nextjs13-storyblok
</h1>
	<p align="center">Nextjs with App directory integration for the <a href="http://www.storyblok.com" target="_blank">Storyblok</a> Headless CMS.</p> <br />
</div>

## Installation

Install `@storyblok/js`:

```bash
npm install @storyblok/js
```

Create a new file and add code to `utils/storyblok.ts` and replace the `accessToken` with the preview API token of your Storyblok space.

```js
import { storyblokInit, apiPlugin } from '@storyblok/js'

const { storyblokApi } = storyblokInit({
  accessToken: '<your-access-token>',
  bridge: true,
  apiOptions: {
    cache: { type: 'memory' },
  },
  use: [apiPlugin],
})

export async function getLinks() {
  if (!storyblokApi) {
    return
  }
  const { data } = await storyblokApi.get('cdn/links', {
    version: 'draft',
  })
  const links = data ? data.links : null
  return links
}

export async function getStory(slug: string) {
  if (!storyblokApi) {
    return
  }
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: 'draft',
  })
  const story = data ? data.story : null
  return story
}
```

### Options

When you initialize the integration, you can pass all [_@storyblok/js_ options](https://github.com/storyblok/storyblok-js#features-and-api). For spaces created in the United States, you have to set the `region` parameter accordingly `{ apiOptions: { region: 'us' } }`.

```js
// Defaults
storyblok({
  accessToken: '<your-access-token>',
  bridge: true,
  apiOptions: {}, // storyblok-js-client options
  useCustomApi: false,
})
```

> Note: By default, the apiPlugin from `@storyblok/js` is loaded. If you want to use your own method to fetch data from Storyblok, you can disable this behavior by setting `useCustomApi` to `true`, resulting in an optimized final bundle.

## Getting started

### 1. Creating and linking your components to the Storyblok Visual Editor

In order to link your components to their equivalents you created in Storyblok:

First, let's create a StoryblokComponent where we can load dynamically the component `StoryblokComponent.tsx`:

```javascript
import React, { forwardRef } from 'react'
import { ComponentsMap } from './components-list'
import { SbBlokData } from '@storyblok/js'

interface StoryblokComponentProps {
  blok: SbBlokData
    [key: string]: unknown
}

export function StoryblokComponent({ blok, ...restProps }, ref): forwardRef<
  HTMLElement,
  StoryblokComponentProps
  > {
  if (!blok) {
    console.error("Please provide a 'blok' property to the StoryblokComponent")
    return <div>Please provide a blok property to the StoryblokComponent</div>
  }
  if(blok.component) {
    const Component = getComponent(blok.component)
    if (Component) {
      return <Component ref={ref} blok={blok} {...restProps} />
    }
  }
  return <></>
}

const getComponent = (componentKey: string) => {
  if (!ComponentsMap[componentKey]) {
    console.error(`Component ${componentKey} doesn't exist.`)
    return false
  }
  return ComponentsMap[componentKey]
}
```

Then create a file `components-list.ts`:

```javascript
import PageStory from './page/PageStory'
import Grid from './grid/Grid'
import Feature from './feature/Feature'
import Teaser from './teaser/Teaser'

export const ComponentsMap = {
  page: PageStory,
  grid: Grid,
  feature: Feature,
  teaser: Teaser,
}
```

For each component, use the `storyblokEditable()` function on its root element, passing the `blok` property that they receive:

For the components `Teaser` for exemple create a file `Teaser.tsx` in the `components folder`:

```javascript
import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../../models/blok-component.model'
import { SbBlokData, storyblokEditable } from '@storyblok/js'

interface TeaserProps extends SbBlokData {
  headline: string
}

const Teaser: FunctionComponent<BlokComponentModel<TeaserProps>> = ({blok}) => {
  return <h2 {...storyblokEditable(blok)}>{blok.headline}</h2>
}

export default Teaser
```

Finally, you can use the provided `<StoryblokComponent>` for nested components :

```javascript
import { StoryblokComponent } from '../StoryblokComponent'
import { SbBlokData, storyblokEditable } from '@storyblok/js'
import { FunctionComponent } from "react";
import { BlokComponentModel } from "../../models/blok-component.model";

interface PageStoryProps extends SbBlokData{
  body: SbBlokData[]
}
const PageStory: FunctionComponent<BlokComponentModel<PageStoryProps>> = ({ blok }) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
}

export default PageStory

```

> Note: The `blok` is the actual blok data coming from [Storyblok's Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2).

#### Let's get our first Story page

In `app/page.tsx` :

```javascript
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
```

### 2. Use the Storyblok Bridge

Use the `loadStoryblokBridge` function to have access to an instance of `storyblok-js`:

```javascript
'use client'
import { loadStoryblokBridge } from '@storyblok/js'

const StoryblokBridge = () => {
  loadStoryblokBridge().then(() => {
    const { StoryblokBridge, location } = window
    const storyblokInstance = new StoryblokBridge()
    storyblokInstance.on(['published', 'change'], () => {
      location.reload()
    })
  })
  return <></>
}

export default StoryblokBridge
```

#### Dynamic Routing

In order to dynamically generate Nextjs pages based on the Stories in your Storyblok Space, you can use the [Storyblok Links API](https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links) and the Nextjs [`generateStaticParams()` function](https://beta.nextjs.org/docs/api-reference/generate-static-params) similar to this example:

```javascript
import styles from '../page.module.css'
import { StoryblokComponent } from '../../components/StoryblokComponent'
import { getLinks, getStory } from '../../utils/storyblok'

interface Paths {
  slug: string[];
}
export async function generateStaticParams() {
  const links = await getLinks()
  const paths: Paths[] = []
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

export default async function Page({ params }: { params: Paths }) {
  const { props } = await fetchData(params)
  return (
    <main className={styles.container}>
      <StoryblokComponent blok={props.story.content} />
    </main>
  )
}
```

### Using the Storyblok Bridge

> Note: At the moment the Storyblok Bridge implementation will not provide real-time editing as Nextjs12. However, it automatically refreshes the site for you whenever you save or publish a story.

### Support

- Bugs or Feature Requests? [Submit an issue](/../../issues/new);
- Do you have questions about Storyblok or you need help? [Join the Storyblok Discord Community](https://discord.gg/jKrbAMz).
