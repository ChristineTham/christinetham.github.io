import rss from '@astrojs/rss'
// import { getImage } from 'astro:assets'
import { getEntries, getEntry } from 'astro:content'
import { SiteMetadata, defaultImage, getPosts } from '../config'

export async function GET(context) {
  const defaultauthor = await getEntry('author', 'default')

  const posts = await getPosts()
  return rss({
    // `<title>` field in output xml
    title: SiteMetadata.title,
    // `<description>` field in output xml
    description: SiteMetadata.description,
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      atom: 'http://www.w3.org/2005/Atom'
    },
    // add atom:link to be compatible with atom
    customData: `
      <atom:link href="${import.meta.env.BASE_URL}rss.xml" rel="self" type="application/rss+xml" />
      <language>en</language>
      <pubDate>${SiteMetadata.buildTime.toISOString()}</pubDate>
      <lastBuildDate>${SiteMetadata.buildTime.toISOString()}</lastBuildDate>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <generator>Astro</generator>
      <managingEditor>${SiteMetadata.author.email}</managingEditor>
      <webMaster>${SiteMetadata.author.email}</webMaster>
    `,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required data and advanced use cases
    items: await Promise.all(
      posts.map(async (post) => {
        const author = post.data.author ? await getEntry(post.data.author) : defaultauthor
        const categories = post.data.categories && (await getEntries(post.data.categories))
        // const image = await getImage({
        //   src:
        //     post.data.socialImage ||
        //     post.data.coverImage ||
        //     (post.data.images && post.data.images[0]) ||
        //     (categories && categories[0].data.socialImage) ||
        //     defaultImage,
        //   width: 1200,
        //   format: 'jpg'
        // })
        const image = post.data.socialImage ||
            post.data.coverImage ||
            (post.data.images && post.data.images[0]) ||
            (categories && categories[0].data.socialImage) ||
            defaultImage

        return {
          link: import.meta.env.BASE_URL + '/blog/' + post.slug,
          title: post.data.title,
          author: `${author.data.title} (${author.data.contact})`,
          description: post.data.description,
          pubDate: post.data.pubDate,
          // custom data for media. The url must be the full url (including https://)
          customData: `
            <media:content
              type="image/jpeg"
              width="${image.width}"
              height="${image.height}"
              medium="image"
              url="${context.site + image.src.slice(1)}" />
            ${categories ? categories.map((category) => '<category>' + category.data.title + '</category>').join('\n') : ''}
          `
        }
      })
    )
  })
}

//   // cannot use posts.forEach() due to race conditions
//   for (let i = 0; i < posts.length; i++) {
//     const post = posts[i]
//     const categoriesdetail = await getEntries(post.data.categories)

//     posts[i].image =
//       post.data.coverImage ||
//       (post.data.images && post.data.images[0]) ||
//       post.data.socialImage ||
//       categoriesdetail[0].data.socialImage ||
//       defaultImage
//     // const image150 = await getImage({src: posts[i].image, format: 'jpg', width: 150})
//     // posts[i].image.src = image150.src
//     // posts[i].image.width = image150.attributes.width
//     // posts[i].image.height = image150.attributes.height
//     // posts[i].image.format = 'jpeg'
//     if (posts[i].image.format == 'jpg') {
//       posts[i].image.format = 'jpeg'
//     }
//     if (post.data.author) {
//       const authordetail = await getEntry(post.data.author)
//       posts[i].author = authordetail.data.title
//     } else {
//       posts[i].author = defaultauthor.data.title
//     }

//     posts[i].categories = categoriesdetail.map((category) => category.data.title)
//   }

//   return {
//     body: `<?xml version="1.0"?>
// <rss xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://pURL.org/dc/elements/1.1/" version="2.0">
//   <channel>
//     <title>${SiteMetadata.title}</title>
//     <link>${import.meta.env.SITE}</link>
//     <description>${SiteMetadata.title}</description>
//     <language>en</language>
//     <pubDate>${SiteMetadata.buildTime.toISOString()}</pubDate>
//     <lastBuildDate>${SiteMetadata.buildTime.toISOString()}</lastBuildDate>
//     <docs>https://www.rssboard.org/rss-specification</docs>
//     <generator>Astro</generator>
//     <managingEditor>${SiteMetadata.author.email}</managingEditor>
//     <webMaster>${SiteMetadata.author.email}</webMaster>
// ${posts
//   .map(
//     (post) => `    <item>
//       <title><![CDATA[${post.data.title}]]></title>
//       <link>${new URL('/blog/' + post.slug, import.meta.env.SITE).toString()}</link>
//       <author>${post.author}</author>
//       <description><![CDATA[${post.data.description}]]></description>
//       <pubDate>${post.data.publishDate.toISOString()}</pubDate>
//       <media:content URL="${new URL(
//         post.image.src.split('?')[0],
//         import.meta.env.SITE
//       ).toString()}" type="image/${post.image.format}" medium="image" height="${
//         post.image.height
//       }" width="${post.image.width}"/>
//       <guid>${new URL('/blog/' + post.slug, import.meta.env.SITE).toString()}</guid>
// ${post.categories.map((category) => '      <category>' + category + '</category>').join('\n')}
//     </item>`
//   )
//   .join('\n')}
//   </channel>
// </rss>
// `
//   }
// }
