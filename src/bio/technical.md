---
section: This Website
title: Technical Details
description: Technologies used in creating this website
weight: 920
---

This site is written using the [Astro](https://astro.build) framework and static site generator. It is written in Typescript and TailwindCSS. It supports Markdown and MDX based pages and blog posts.

## Integrations

It uses the following official and third party Astro integrations:

- @astrojs/mdx
- @astrojs/image
- @astrojs/sitemap
- @astrojs/rss
- @astrojs/tailwind
- @astrojs/alpinejs
- astro-icon
- astro-seo
- astro-robots-txt

## Features

- Full-featured blog with frontmatter (title, description, author, date, image, tags)
- High performance low overhead with minimal Javascript (AlpineJS)
- Full text client based search of blog pages via lunrjs (search index only loaded on first invocation of search on a page)
- Index page and individual pages for authors, categories and tags, including pagination
- Support for RSS feed, sitemap and robots.txt
- SVG design (unDraw, Hero Patterns, Iconify)
- Support for code syntax highlighting
- Full SEO support including Open Graph, Twitter Cards and Schema.org via JSON-LD
- Full support for Light and dark UI modes, as well as following system preferences, in accordance to TailwindCSS recommendation
- Customised 404 error page
- Display math equations using KaTeX via remark-math/rehype-katex (enclosed in `$`...`$` or `$$`...`$$`)
- Display Mermaid, Markmap, PlantUML diagrams (authored as a code block with language `mermaid`, `markmap` and `plantuml`)
- Display map at geo coordinates and zoom level using `Map` component (need to also include `extra: ['map']` is frontmatter to load CSS/JS assets for page)
- Calculates and show reading time for blog posts
- CSS/JS assets of external libraries loaded only when needed on a per page and per package basis - no unnecessary bloat
- Photo gallery and lightbox using PhotoSwipe (including display of EXIF tags)
- Carousel component using Swiper
- Documentation pages (modelled after astro docs starter but using Tailwind)

## External Packages

The start uses the following external packages:

- [Astro](https://astro.build/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com) and [TailwindUI](https://tailwindui.com)
- [Iconify](https://iconify.design/)
- [Hero Patterns](https://heropatterns.com/)
- [unDraw](https://undraw.co/) for illustrations
- [MDX](https://mdxjs.com/) and [Markdown](https://www.markdownguide.org/)
- [Schema.org](https://schema.org/) and [JSON for Linking Data](https://json-ld.org/), type-checked using [schema-dts](https://github.com/google/schema-dts)
- [Open Graph](https://ogp.me/) used by [Facebook](https://developers.facebook.com/docs/sharing/webmasters/#markup)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [AlpineJS](https://alpinejs.dev)
- Local full text search using [Lunr](https://lunrjs.com)
- Math equations using [KaTeX](https://katex.org) via [remark-math and rehype-katex](https://github.com/remarkjs/remark-math)
- Diagrams using [Mermaid](https://mermaid-js.github.io/mermaid/#/), [Markmap](https://markmap.js.org) and [PlantUML](https://plantuml.com)
- Open Street Map using [Leaflet](https://leafletjs.com/)
- [reading-time](https://github.com/ngryman/reading-time)
- [PhotoSwipe](https://photoswipe.com)
- [exifr](https://mutiny.cz/exifr/)
- [Swiper](https://swiperjs.com/)

It follows the [JAMstack architecture](https://jamstack.org) by automatically building a static version from the Git repository. The demo is deployed on Github Pages.
