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
import React, { FunctionComponent } from 'react'
import { ComponentsMap } from './components-list'
import { SbBlokData } from '@storyblok/js'

interface StoryblokComponentProps {
  blok: SbBlokData
    [key: string]: unknown
}

export const StoryblokComponent: FunctionComponent<StoryblokComponentProps> = ({ blok, ...restProps }) => {
  if (!blok) {
    console.error("Please provide a 'blok' property to the StoryblokComponent")
    return <div>Please provide a blok property to the StoryblokComponent</div>
  }
  if(blok.component) {
    const Component = getComponent(blok.component)
    if (Component) {
      return <Component blok={blok} {...restProps} />
    }
  }
  return <></>
}

const getComponent = (componentKey: string) => {
  // @ts-ignore
  if (!ComponentsMap[componentKey]) {
    console.error(`Component ${componentKey} doesn't exist.`)
    return false
  }
// @ts-ignore
  return ComponentsMap[componentKey]
}

```

Then create a file `components-list.ts`:

```javascript
import PageStory from './page/PageStory'
import Grid from './grid/Grid'
import Feature from './feature/Feature'
import Teaser from './teaser/Teaser'
import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../models/blok-component.model'

interface ComponentsMapProps {
  [key: string]: FunctionComponent<BlokComponentModel<any>>;
}
export const ComponentsMap: ComponentsMapProps = {
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
  headline: string;
}

const Teaser: FunctionComponent<BlokComponentModel<TeaserProps>> = ({
  blok,
}) => {
  return <h2 {...storyblokEditable(blok)}>{blok.headline}</h2>
}

export default Teaser
```

Finally, you can use the provided `<StoryblokComponent>` for nested components :

```javascript
import { StoryblokComponent } from '../StoryblokComponent'
import { SbBlokData, storyblokEditable } from '@storyblok/js'
import { FunctionComponent } from 'react'
import { BlokComponentModel } from '../../models/blok-component.model'

interface PageStoryProps extends SbBlokData {
  body: SbBlokData[];
}
const PageStory: FunctionComponent<BlokComponentModel<PageStoryProps>> = ({
  blok,
}) => {
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
  //Add this code if you need to use preview mode
  const isPreviewMode = !!data && data.key === 'MY_SECRET_TOKEN';
  const version = process.env.NEXT_PUBLIC_STORYBLOK_VERSION;
  return (
    <main className={ styles.container }>
      { isPreviewMode || version === 'draft' ?
        <StoryblokBridge blok={ props.story.content }/> :
        <StoryblokComponent blok={ props.story.content }/>
      }
    </main>
  )
}

```

### 2. Use the Storyblok Bridge

Use the `loadStoryblokBridge` function to have access to an instance of `storyblok-js`:

```javascript
'use client'
import { loadStoryblokBridge, SbBlokData } from '@storyblok/js'
import { StoryblokComponent } from './StoryblokComponent'
import { useState } from 'react'

const StoryblokBridge = ({ blok }: { blok: SbBlokData }) => {
  const [blokState, setBlokState] = useState(blok)
  loadStoryblokBridge()
    .then(() => {
      const { StoryblokBridge, location } = window
      const storyblokInstance = new StoryblokBridge()
      storyblokInstance.on(['published', 'change'], () => {
        location.reload()
      })
      storyblokInstance.on(['input'], (e) => {
        setBlokState(e?.story?.content)
      })
    })
    .catch((err) => console.error(err))
  return <StoryblokComponent blok={blokState} />
}

export default StoryblokBridge
```

#### Dynamic Routing

In order to dynamically generate Nextjs pages based on the Stories in your Storyblok Space, you can use the [Storyblok Links API](https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links) and the Nextjs [`generateStaticParams()` function](https://beta.nextjs.org/docs/api-reference/generate-static-params) similar to this example:

```javascript
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
  //Add this code if you need to use preview mode
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
```

### Using the Storyblok Bridge and preview mode

Create an API route for the preview, it should be defined at `pages/api/preview.js`

```javascript
export default async function preview(req, res) {
  const { slug = '' } = req.query
  // get the storyblok params for the bridge to work
  const params = req.url.split('?')

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== 'MY_SECRET_TOKEN') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Enable Preview Mode by setting the cookies
  const location = `/${slug}?${params[1]}`
  res.setPreviewData({
    key: req.query.secret,
  })

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie')
  res.setHeader(
    'Set-Cookie',
    cookies.map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    )
  )

  res.writeHead(307, { Location: location })
  res.end()
}
```

And in order to exit preview mode create a file `pages/api/exit-preview.js`

```javascript
export default async function exit(req, res) {
  const { slug = '' } = req.query
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData({})

  // set the cookies to None
  const cookies = res.getHeader('Set-Cookie')
  res.setHeader(
    'Set-Cookie',
    cookies.map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    )
  )

  // Redirect the user back to the index page.
  res.redirect(`/${slug}`)
}
```

### Support

- Bugs or Feature Requests? [Submit an issue](/../../issues/new);
- Do you have questions about Storyblok or you need help? [Join the Storyblok Discord Community](https://discord.gg/jKrbAMz).
