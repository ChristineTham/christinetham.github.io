// 1. Import your utilities and schemas
import { z, defineCollection, reference } from 'astro:content'

// 2. Define your collections
const blogCollection = defineCollection({
  schema: ({image}) => z.object({
    draft: z.boolean().optional(),
    title: z.string(),
    description: z.string(),
    author: reference('author').optional(),
    publishDate: z.date(),
    coverImage: image().optional(),
    socialImage: image().optional(),
    images: z.array(image()).optional(),
    gallery: z.string().optional(),
    categories: z.array(reference('category')),
    tags: z.array(z.string()).optional(),
    extra: z
      .array(z.enum(['math', 'markmap', 'mermaid', 'gallery']))
      .optional(),
    minutesRead: z.string().optional(),
  }),
})

const bioCollection = defineCollection({
  schema: ({image}) => z.object({
    draft: z.boolean().optional(),
    section: z.string(),
    weight: z.number().default(0),
    title: z.string(),
    description: z.string(),
    images: z.array(image()).optional(),
    gallery: z.string().optional(),
  }),
})

const categoryCollection = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    icon: image(),
    coverImage: image(),
    socialImage: image(),
  }),
})

const authorCollection = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    contact: z.string().email(),
    image: image(),
  }),
})

const websiteCollection = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().url(),
    image: image(),
    featured: z.boolean().optional(),
  }),
})

const pageCollection = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    coverImage: image().optional(),
    socialImage: image().optional(),
  }),
})

// 3. Export multiple collections to register them
export const collections = {
  blog: blogCollection,
  bio: bioCollection,
  category: categoryCollection,
  author: authorCollection,
  website: websiteCollection,
  page: pageCollection,
}
