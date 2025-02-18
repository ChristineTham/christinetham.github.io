// 1. Import your utilities and schemas
import { z, defineCollection, reference } from 'astro:content'
import { rssSchema } from '@astrojs/rss'
import { glob, file } from 'astro/loaders'

// 2. Define your collections
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/page' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/bio' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/category' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/author' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      contact: z.string().email(),
      image: image()
    })
})

const website = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/website' }),
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
  loader: file('src/social.json', { parser: (text) => JSON.parse(text) })
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
