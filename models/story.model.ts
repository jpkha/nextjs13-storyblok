import { Content } from './content.model'

export interface Story {
  name: string
  created_at: string
  published_at: Date
  id: number
  uuid: string
  content: Content
  slug: string
  full_slug: string
  sort_by_date: null
  position: number
  tag_list: any[]
  is_startpage: boolean
  parent_id: number
  meta_data: null
  group_id: string
  first_published_at: Date
  release_id: null
  lang: string
  path: null | string
  alternates: any[]
  default_full_slug: null
  translated_slugs: null
}
