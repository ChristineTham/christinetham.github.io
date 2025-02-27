import { getCollection } from 'astro:content'
import { getAllPosts } from '../common/config.ts'
import { SiteMetadata } from '../common/config'

const docs = await getCollection('bio', (p) => !p.data.draft)
const posts = getAllPosts()

let documents = await Promise.all(
  posts.map(async (post) => {
    return {
      url: import.meta.env.BASE_URL + post.id,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.publishDate,
      categories: post.data.categories,
      tags: post.data.tags
    }
  })
)
documents = documents.concat(
  docs.map((doc) => ({
    url: import.meta.env.BASE_URL + 'bio/' + doc.id,
    title: doc.data.title,
    description: doc.data.description,
    publishDate: SiteMetadata.buildTime,
    categories: ['biography'],
    tags: ['biography']
  }))
)

export async function GET() {
  return new Response(JSON.stringify(documents), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
