// 1. Import your utilities and schemas
import { z, defineCollection, reference } from 'astro:content'
import { rssSchema } from '@astrojs/rss'

// 2. Define your collections
const blog = defineCollection({
  schema: ({ image }) =>
    rssSchema.extend({
      draft: z.boolean().optional(),
      title: z.string(),
      description: z.string(),
      author: reference('author').optional(),
      coverImage: image().optional(),
      socialImage: image().optional(),
      images: z.array(image()).optional(),
      gallery: z.string().optional(),
      categories: z.array(reference('category')),
      tags: z.array(z.string()).optional(),
      extra: z.array(z.enum(['math', 'markmap', 'mermaid', 'gallery'])).optional(),
      minutesRead: z.string().optional()
    })
})

const page = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      author: reference('author').optional(),
      pubDate: z.date().optional(),
      coverImage: image().optional(),
      socialImage: image().optional(),
      images: z.array(image()).optional(),
      gallery: z.string().optional(),
      categories: z.array(reference('category')).optional(),
      tags: z.array(z.string()).optional(),
      extra: z.array(z.enum(['math', 'markmap', 'mermaid', 'gallery'])).optional()
    })
})

const bio = defineCollection({
  schema: ({ image }) =>
    z.object({
      draft: z.boolean().optional(),
      section: z.string(),
      weight: z.number().default(0),
      title: z.string(),
      description: z.string(),
      images: z.array(image()).optional(),
      gallery: z.string().optional()
    })
})

const category = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      icon: image(),
      coverImage: image(),
      socialImage: image()
    })
})

const author = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      contact: z.string().email(),
      image: image()
    })
})

const website = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().url(),
      image: image(),
      featured: z.boolean().optional()
    })
})

const social = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    link: z.string(),
    icon: z.string()
  })
})

// 3. Export multiple collections to register them
export const collections = {
  blog,
  page,
  bio,
  category,
  author,
  website,
  social
}
