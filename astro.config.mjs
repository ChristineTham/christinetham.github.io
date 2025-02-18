import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx'
import alpinejs from '@astrojs/alpinejs'
import robotsTxt from 'astro-robots-txt'
import icon from "astro-icon";
import expressiveCode from 'astro-expressive-code';

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import remarkPlantUML from '@akebifiky/remark-simple-plantuml'
import { remarkReadingTime } from './remark-plugins/remark-reading-time.mjs';
import { remarkDiagram } from './remark-plugins/remark-diagram.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://christham.net',
  integrations: [icon(), sitemap(), alpinejs(), robotsTxt(), expressiveCode(), mdx()],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remarkReadingTime, remarkMath, remarkPlantUML, remarkDiagram],
    rehypePlugins: [rehypeKatex,rehypeMermaid]
  },
  vite: {
    plugins: [tailwindcss()]
  }
})