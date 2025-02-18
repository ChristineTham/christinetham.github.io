import { getCollection, getEntries } from 'astro:content'
import { SiteMetadata } from '../config'

const docs = await getCollection('bio', (p) => {
  return !p.data.draft
})
const posts = await getCollection('blog', (p) => {
  return !p.data.draft
})
let documents = await Promise.all(
  posts.map(async (post) => {
    const categories = post.data.categories && (await getEntries(post.data.categories))

    return {
      url: import.meta.env.BASE_URL + 'blog/' + post.id,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.publishDate,
      categories: categories && categories.map((category) => category.data.title),
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
