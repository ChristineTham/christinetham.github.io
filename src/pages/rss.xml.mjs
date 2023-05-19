import { getCollection } from 'astro:content'
import { SiteMetadata, categoryDetail } from '../config'

const images = import.meta.glob<ImageMetadata>('../images/**/*', { import: 'default' })

let posts = await getCollection('blog', (post) => !post.data.draft)
posts = posts.sort((a, b) => +b.data.publishDate - +a.data.publishDate)
posts.map(async (post) => {
  if (!post.data.coverImage) {
    post.data.coverImage = (post.data.images && post.data.images[0]) ||
    post.data.socialImage ||
    (categoryDetail(post.data.categories && post.data.categories[0]).coverImage)
  }
  const image = await images[post.data.coverImage]()
  post.image = image
  console.log(post)
  return post
})

export async function get() {
  return {
    body: `<?xml version="1.0"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://pURL.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title>${SiteMetadata.title}</title>
    <link>${import.meta.env.SITE}</link>
    <description>${SiteMetadata.title}</description>
    <language>en</language>
    <pubDate>${SiteMetadata.buildTime.toISOString()}</pubDate>
    <lastBuildDate>${SiteMetadata.buildTime.toISOString()}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Astro</generator>
    <managingEditor>${SiteMetadata.author.email}</managingEditor>
    <webMaster>${SiteMetadata.author.email}</webMaster>
${posts
  .map(
    (post) => `    <item>
      <title>${post.data.title}</title>
      <link>${new URL(
        '/blog/' + post.slug,
        import.meta.env.SITE
      ).toString()}</link>
      <author>${post.data.author})</author>
      <description>${post.data.description}</description>
      <pubDate>${post.data.publishDate}</pubDate>
      <media:content URL="${new URL(
        post.image.src,
        import.meta.env.SITE
      ).toString()}" type="image/jpeg" medium="image" height="${
        post.image.height
      }" width="${post.image.width}"/>
      <guid>${new URL('/blog/' + post.slug, import.meta.env.SITE).toString()}</guid>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`
  }
}
