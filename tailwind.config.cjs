/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rosely0: '#27272a',
        rosely1: '#615F5F',
        rosely2: '#A49E9E',
        rosely3: '#F4EEE8',
        rosely4: '#EC809E',
        rosely5: '#F7CACA',
        rosely6: '#F8D7DD',
        rosely7: '#F4DEDE',
        rosely8: '#85677B',
        rosely9: '#B565A7',
        roselyA: '#BE9CC1',
        roselyB: '#D2C4D6',
        roselyC: '#D2386C',
        roselyD: '#64BFA4',
        roselyE: '#3CADD4',
        roselyF: '#EADA4F',
        primary: '#8c4e80',
      },      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
