import { getCollection, getEntry, getEntries } from 'astro:content'
import { getImage } from "astro:assets"
import { SiteMetadata, defaultImage } from '../config'

export async function get() {
  const defaultauthor = await getEntry('author', 'default')

  let posts = await getCollection('blog', (post) => !post.data.draft)
  posts = posts.sort((a, b) => +b.data.publishDate - +a.data.publishDate)
  
  // cannot use posts.forEach() due to race conditions
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const categoriesdetail = await getEntries(post.data.categories)

    posts[i].image = post.data.coverImage ||
      (post.data.images && post.data.images[0]) ||
      post.data.socialImage ||
      categoriesdetail[0].data.socialImage || 
      defaultImage
    // const image150 = await getImage({src: posts[i].image, format: 'jpg', width: 150})
    // posts[i].image.src = image150.src
    // posts[i].image.width = image150.attributes.width
    // posts[i].image.height = image150.attributes.height
    // posts[i].image.format = 'jpeg'
    if (posts[i].image.format == 'jpg') {
      posts[i].image.format = 'jpeg'      
    }
    if (post.data.author) {
      const authordetail = await getEntry(post.data.author)
      posts[i].author = authordetail.data.title
    }
    else {
      posts[i].author = defaultauthor.data.title
    }

    posts[i].categories = categoriesdetail.map(category => category.data.title)
  }

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
      <title><![CDATA[${post.data.title}]]></title>
      <link>${new URL(
        '/blog/' + post.slug,
        import.meta.env.SITE
      ).toString()}</link>
      <author>${post.author}</author>
      <description><![CDATA[${post.data.description}]]></description>
      <pubDate>${post.data.publishDate.toISOString()}</pubDate>
      <media:content URL="${new URL(
        post.image.src.split('?')[0],
        import.meta.env.SITE
      ).toString()}" type="image/${post.image.format}" medium="image" height="${
        post.image.height
      }" width="${post.image.width}"/>
      <guid>${new URL('/blog/' + post.slug, import.meta.env.SITE).toString()}</guid>
${post.categories.map(category => '      <category>' + category + '</category>').join('\n')}
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`
  }
}
