import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Frontend Bible",
  vite: {
    plugins: [
      SearchPlugin()
    ]
  },
  cleanUrls: true,
  description: "The Frontend Bible is a collection of best practices, design patterns, and libraries for building Vue.js applications.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],
    logo: '/logo.png',
    sidebar: [
      { text: 'Components', link: '/components', items: [
          { text: 'Naming', link: '/components/components-naming' },
          { text: 'Structure', link: '/components/components-structure' },
          { text: 'Smart vs Dumb', link: '/components/components-smart-dumb' },
          { text: 'Props', link: '/components/components-props' },
          { text: 'Emits', link: '/components/components-emits' },
          { text: 'Slots', link: '/components/components-slots' },
          { text: 'Testing', link: '/components/components-testing' },
          { text: 'Accessibility', link: '/components/components-accessibility' },
        ]
      },
      {
        text: 'Design patterns', link: '/design-patterns', items: [
          {
            text: 'Solid',
            link: '/design-patterns/design-patterns-solid',
          }
        ],
      },
      { text: 'Reusable code', link: 'reusable-code', items: [
          { text: 'Composables', link: '/reusable-code/reusable-composables' },
          { text: 'Utils', link: '/reusable-code/reusable-utils' },
          { text: 'Stores', link: '/reusable-code/reusable-stores' },
          { text: 'Services', link: '/reusable-code/reusable-services' },
          { text: 'Router', link: '/reusable-code/reusable-router' },
          { text: 'Authentication', link: '/reusable-code/reusable-authentication' },
      ]},
      { text: 'Libraries', link: '/libraries'},
      { text: 'Naming conventions', link: '/naming-conventions'},
      { text: 'Testing', link: '/testing'},
      { text: 'Project structure', link: '/project-structure'},
      { text: 'ESLint config', link: '/eslint-config'},
      { text: 'Teamwork', link: '/teamwork'},
      { text: 'Tools', link: '/tools'},
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/appwise-labs/frontend-bible' }
    ]
  }
})
