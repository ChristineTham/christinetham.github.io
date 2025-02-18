import { getCollection, getEntry } from 'astro:content'
import lunr from 'lunr'
import { SiteMetadata } from '../config'

const defaultauthor = await getEntry('author', 'default')

const docs = await getCollection('bio', (p) => {
  return !p.data.draft
})
const posts = await getCollection('blog', (p) => {
  return !p.data.draft
})
let documents = await Promise.all(
  posts.map(async (post) => {
    const author = post.data.author ? await getEntry(post.data.author) : defaultauthor
    return {
      url: import.meta.env.BASE_URL + 'blog/' + post.id,
      title: post.data.title,
      description: post.data.description,
      author: `${author.data.title} (${author.data.contact})`,
      categories: post.data.categories,
      tags: post.data.tags,
      content: post.body
    }
  })
)
documents = documents.concat(
  docs.map((doc) => ({
    url: import.meta.env.BASE_URL + 'bio/' + doc.id,
    title: doc.data.title,
    description: doc.data.description,
    author: `${SiteMetadata.author.name} (${SiteMetadata.author.email})`,
    categories: ['biography'],
    tags: ['biography'],
    content: doc.body
  }))
)

const idx = lunr(function () {
  this.ref('url')
  this.field('title')
  this.field('description')
  this.field('author')
  this.field('categories')
  this.field('tags')
  this.field('content')

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})

export async function GET() {
  return new Response(JSON.stringify(idx), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
