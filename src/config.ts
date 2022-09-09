import type { MarkdownInstance } from 'astro'

export interface Frontmatter {
  draft?: boolean
  title: string
  description?: string
  author?: string
  publishDate: string
  coverSVG?: string
  coverImage?: string
  socialImage?: string
  categories?: string[]
  tags?: string[]
  file?: string
  url?: string
  minutesRead?: string
  extra?: string[]
  section?: string[]
}

export interface TagType {
  tag: string
  count: number
  pages: MarkdownInstance<Frontmatter>[]
}

export const SiteMetadata = {
  title: 'Chris Tham',
  description: 'Personal Web Site',
  author: {
    name: 'Chris Tham',
    twitter: '@chris1tham',
    url: 'https://christham.net',
    email: 'chris@christham.net',
    summary: 'Outrageous actualiser.',
  },
  org: {
    name: 'Hello Tham',
    twitter: '@hellothamcom',
    url: 'https://hellotham.com',
    email: 'info@hellotham.com',
    summary:
      'Hello Tham is a boutique management consulting firm. We specialise in Business and IT strategies, operating models, strategic roadmaps, enterprise architecture, analytics and business process design.',
  },
  location: 'Sydney, Australia',
  latlng: [-33.86785, 151.20732] as [number, number],
  repository: 'https://github.com/ChristineTham/christham-astro',
  social: [
    {
      name: 'Email',
      link: 'mailto:chris@christham.net',
      icon: 'envelope',
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/christham',
      icon: 'linkedin',
    },
    {
      name: 'Facebook',
      link: 'https://www.facebook.com/chris1tham',
      icon: 'facebook',
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/chris1tham',
      icon: 'instagram',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/chris1tham',
      icon: 'twitter',
    },
    {
      name: 'Github',
      link: 'https://github.com/ChristineTham',
      icon: 'github',
    },
  ],
  buildTime: new Date().toString(),
}

export const Logo = '../svg/logo.svg'
export const LogoImage = '/images/logo.png'
export const DefaultSVG = '../svg/undraw/my_feed.svg'
export const DefaultImage = '../images/undraw/my_feed.png'

export const NavigationLinks = [
  { name: 'Home', href: '' },
  { name: 'About', href: 'about' },
  { name: 'Contact', href: 'contact' },
  { name: 'Blog', href: 'blog' },
  { name: 'Websites', href: 'websites' },
]

export const CategoryDetail = [
  {
    category: 'Art',
    icon: '../svg/kawaii/easel.svg',
    coverSVG: '../svg/undraw/making_art.svg',
    socialImage: '../images/undraw/making_art.png',
    description: 'I am a great admirer of art and we love to visit art galleries wherever we go.',
    content: 'In addition, I sometimes dabble with drawings with pencil, COPIC markers, watercolours and even fountain pens. I also love the idea of Zentagle.'
  },
  {
    category: 'Create',
    icon: '../svg/kawaii/portfolio.svg',
    coverSVG: '../svg/undraw/deconstructed.svg',
    socialImage: '../images/undraw/deconstructed.png',
    description: 'I love creating things, and this page summarises posts where I have created things.',
    content: ''
  },
  {
    category: 'Cycling',
    icon: '../svg/kawaii/bicycle.svg',
    coverSVG: '../svg/undraw/bike_ride.svg',
    socialImage: '../images/undraw/bike_ride.png',
    description: 'I like to cycle for fun and exercise.',
    content: 'I cycled when I was in primary school, but crashed my Raleigh three-speed into a fence, and then never cycled again until my 40s, when I bought a hybrid bicycle for exercise. I soon graduated to road bikes, and currently own a number of road bikes.'
  },
  {
    category: 'Design',
    icon: '../svg/kawaii/love.svg',
    coverSVG: '../svg/undraw/building_websites.svg',
    socialImage: '../images/undraw/building_websites.png',
    description: 'This category contains a selection of things I have designed.',
    content: 'I love good design, whether it’s a product, clothes, personal accessories or even design as art. I generally like design to be simple, functional, classic, but not necessarily tradition. I also like designing things. My favourite colour is pink, and I try and incorporate that in all my designs. All my websites are designed by me.'
  },
  {
    category: 'Food',
    icon: '../svg/kawaii/noodles.svg',
    coverSVG: '../svg/undraw/breakfast.svg',
    socialImage: '../images/undraw/breakfast.png',
    description: 'I love eating, and sometimes cooking, food.',
    content: 'My favourite cuisines are Thai, Malaysian, Vietnamese, Japanese but also love Modern Australian. When I cook, I generally try to recreate classic Malaysian dishes but with a twist.'
  },
  {
    category: 'Garden',
    icon: '../svg/kawaii/garden-tree.svg',
    coverSVG: '../svg/undraw/blooming.svg',
    socialImage: '../images/undraw/blooming.png',
    description: 'We love beautiful gardens and try and visit as many as we can wherever we travel.',
    content: 'My favourite cuisines are Thai, Malaysian, Vietnamese, Japanese but also love Modern Australian. When I cook, I generally try to recreate classic Malaysian dishes but with a twist.'
  },
  {
    category: 'Music',
    icon: '../svg/kawaii/turntable.svg',
    coverSVG: '../svg/undraw/music.svg',
    socialImage: '../images/undraw/music.png',
    description: 'I love listening, playing and composing music.',
    content: 'My interests in music are broad, ranging from classical, jazz, contemporary to modern. My favourite composer of all time is probably Johann Sebastian Bach, but I also like many of the other classical composers. I listen to mostly Puccini and Wagner operas. In terms of jazz, I love Pat Metheny and Keith Jarrett. I also love electronic music, particularly Vangelis, Tangerine Dream and Jean Michel Jarre. My favourite minimalist composers are Brian Eno, Philip Glass, Steve Reich and John Adams. I listen to range of modern artists including Mike Oldfield, Pet Shop Boys, Madonna, Phil Collins. I also like playing the piano and guitar, and composing music, which I do in my own studio complete with mixing and monitoring consoles, digital audio workstation, and various instruments including a stage piano. I am also obsessed with synthesizers ever since I heard the music of Vangelis on the Cosmos TV series. I currently own a Kawai stage piano, several MIDI controllers (NI Komplete Kontrol A25 and S88MkII) and Maschine 3. I also own various virtual instruments (NI Komplete Ultimate, EastWest, SonicCouture, Sonokinetic, Korg, Roland, UVI). My favourite notation software are Notion and Finale, and I use Logic Pro X as my DAW.'
  },
  {
    category: 'Photography',
    icon: '../svg/kawaii/photo-camera.svg',
    coverSVG: '../svg/undraw/moments.svg',
    socialImage: '../images/undraw/moments.png',
    description: 'I have been taking photos on various cameras since high school.',
    content: 'I started taking photos in high school using my father\'s Yashica rangefinder. I had a series of Pentax SLR bodies and a variety of lenses. With digital photography, I bought a Kodak DC220 in 1999 and currently uses a variety of brands including Sony (α9, α7r, α6500, NEX-F3, NEX-5N, RX100MkIV, HS50V), Leica (M10), Panasonic (GX9), Nikon 1 (J5, V3, V2, J1) and Pentax (K-01).'
  },
  {
    category: 'Travel',
    icon: '../svg/kawaii/map.svg',
    coverSVG: '../svg/undraw/travel_mode.svg',
    socialImage: '../images/undraw/travel_mode.png',
    description: 'I love traveling.',
    content: ''
  },
  {
    category: 'Website',
    icon: '../svg/kawaii/website.svg',
    coverSVG: '../svg/undraw/personal_website.svg',
    socialImage: '../images/undraw/personal_website.png',
    description: 'I love building websites as a hobby.',
    content: ''
  },
]

export function categoryDetail(category: string | undefined) {
  const details = CategoryDetail.filter(cat => cat.category == category)

  if (details.length == 1) {
    return details[0]
  }
  return {
    category: 'General',
    icon: '../svg/kawaii/writing.svg',
    coverSVG: '../svg/undraw/browsing.svg',
    socialImage: '../images/undraw/browsing.png',
    description: 'Category ' + category,
    content: ''
  }
}

export const AuthorDetail = [
  {
    name: 'Chris Tham',
    description: 'Hello World',
    contact: 'chris@christham.net',
    image: '../images/authors/Chris Tham.jpg'
  }
]

export function authorDetail(author: string | undefined) {
  const details = AuthorDetail.filter(person => person.name == author)

  if (details.length == 1) {
    return details[0]
  }
  return {
    name: 'Hello Astro',
    image: '../images/authors/default.png',
    contact: 'info@hellotham.com',
    description: 'Astronaut'
  }
}

export const Websites = [
  {
    website: 'Hello Tham',
    link: 'https://hellotham.com',
    featured: true,
    screenshot: '../images/website/hellotham.png',
    description: 'I founded a booutique strategic consulting company called Hello Tham. This is the corporate website.',
  },
  {
    website: 'Travels Through a Lens',
    link: 'https://travel.christham.net',
    featured: true,
    screenshot: '../images/website/travel.png',
    description: 'This is a travelogue web site that that documents my travel adventures and trips over the years.',
  },
  {
    website: 'Visual Voyager',
    link: 'https://visualvoyager.net',
    featured: true,
    screenshot: '../images/website/visualvoyager.png',
    description: 'This is my photography website, for exploring the world we live in, as seen through our unique perspectives and experiences.',
  },
  {
    website: 'Buddhavacana',
    link: 'https://christham.net/buddhavacana',
    featured: true,
    screenshot: '../images/website/buddhavacana.png',
    description: 'This website documents my study notes learning the Buddhist Theravadan Tipitaka, in Pali.',
  },
  {
    website: 'Chris Tham\'s Portfolio',
    link: 'https://portfolio.christham.net',
    featured: false,
    screenshot: '../images/website/portfolio.png',
    description: 'A one page vanity site featuring some of my websites.',
  },
  {
    website: 'Hons87',
    link: 'https://hons87.github.io',
    featured: false,
    screenshot: '../images/website/hons87.png',
    description: 'A site dedicated to the students of Sydney University Computer Science Honours 1987.',
  },
  {
    website: 'Learning Jamstack',
    link: 'https://learning-jamstack.hellotham.com',
    featured: false,
    screenshot: '../images/website/learningjamstack.png',
    description: 'My adventures learning how to build websites and apps in 2020 using the Jamstack architecture, auto workflows and modern build tools.',
  },
  {
    website: 'Hello Astro',
    link: 'https://hellotham.github.io/hello-astro',
    featured: false,
    screenshot: '../images/website/hello-astro.png',
    description: 'My Astro starter (used as a template for my personal web site).',
  },
  {
    website: 'Chris Tham Hugo',
    link: 'https://christham.net/christham-hugo',
    featured: false,
    screenshot: '../images/website/christham-hugo.png',
    description: 'A prototype version of my personal web site written in Hugo and Bootstrap 5 (based on the doks theme).',
  },
  {
    website: 'Hello Jekyll',
    link: 'https://christham.net/hello-jekyll',
    featured: false,
    screenshot: '../images/website/hello-jekyll.png',
    description: 'My Jekyll starter based on YAT and Bootstrap 5.',
  },
  {
    website: 'Hello Gatsby',
    link: 'https://hello-gatsby-starter.hellotham.com/',
    featured: false,
    screenshot: '../images/website/hello-gatsby.png',
    description: 'My Gatsby starter using TailwindCSS.',
  },
  {
    website: 'Rosely',
    link: 'https://rosely.hellotham.com',
    featured: false,
    screenshot: '../images/website/rosely.png',
    description: 'Rosely is my attempt at building a design system. This currently includes a colour palette.',
  },
  {
    website: 'Prismatic Path',
    link: 'https://prismaticpath.com',
    featured: false,
    screenshot: '../images/website/prismatic.png',
    description: 'A collaboration between Greg Allardice and myself exploring alternate paths in life and learning.',
  },
  {
    website: 'My Record Collection',
    link: 'https://christham-net.netlify.app/',
    featured: false,
    screenshot: '../images/website/record.png',
    description: 'Explore my LP collection. Will eventually be integrated into the personal site.',
  },
  {
    website: 'My Chakra Components',
    link: 'https://my-chakra-components.vercel.app/',
    featured: false,
    screenshot: '../images/website/chakra.png',
    description: 'This site showcases example Chakra components (based on MerakiUI but rewritten in chakra-ui using the NextJS framework.',
  },
  {
    website: 'Rose Bay Residents Association',
    link: 'https://rosebayresidentsassociation.org/',
    featured: false,
    screenshot: '../images/website/rosebay.png',
    description: 'Website for the Rose Bay Residents Association.',
  },
]

export const PAGE_SIZE = 24

export const GITHUB_EDIT_URL = `https://github.com/ChristineTham/christham-astro`

export const COMMUNITY_INVITE_URL = null // `https://astro.build/chat`

export type Sidebar = Record<string, { text: string; link: string }[]>

export const SIDEBAR: Sidebar = {
  'Background': [
    { text: 'Introduction', link: 'about/introduction' },
    { text: 'Tham Surname', link: 'about/tham-surname' },
    { text: 'My Great Grandfather', link: 'about/my-great-grandfather' },
  ],
  'This Website': [{ text: 'Technical Info', link: 'about/website' }],
}
