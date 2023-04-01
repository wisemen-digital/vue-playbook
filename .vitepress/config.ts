import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Frontend Bible",
  vite: {
    plugins: [
      SearchPlugin({
        optimize: true,
        preset: "match",
      })
    ]
  },
  dir: 'src',
  srcDir: 'src',
  cleanUrls: true,
  lastUpdated: true,
  description: "The Frontend Bible is a collection of best practices, design patterns, and libraries for building Vue.js applications.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Team', link: '/team' },
    ],
    editLink: {
      pattern: 'https://github.com/appwise-labs/frontend-bible/blob/main/src/:path'
    },
    logo: '/favicon.png',
    sidebar: [
      { text: 'Components', link: '/components', items: [
          { text: 'Naming', link: '/components/naming' },
          { text: 'Structure', link: '/components/structure' },
          { text: 'Smart vs Dumb', link: '/components/smart-dumb' },
          { text: 'Props', link: '/components/props' },
          { text: 'Emits', link: '/components/emits' },
          { text: 'Slots', link: '/components/slots' },
          { text: 'Testing', link: '/components/testing' },
          { text: 'Accessibility', link: '/components/accessibility' },
        ]
      },
      {
        text: 'Design patterns', link: '/design-patterns', items: [
          {
            text: 'Solid',
            link: '/design-patterns/solid',
          }
        ],
      },
      { text: 'Reusable code', link: '/reusable-code', items: [
          { text: 'Composables', link: '/reusable-code/composables' },
          { text: 'Utils', link: '/reusable-code/utils' },
          { text: 'Stores', link: '/reusable-code/stores' },
          { text: 'Services', link: '/reusable-code/services' },
          { text: 'Router', link: '/reusable-code/router' },
          { text: 'Authentication', link: '/reusable-code/authentication' },
      ]},
      { text: 'Libraries', link: '/libraries'},
      { text: 'Naming conventions', link: '/naming-conventions'},
      { text: 'Testing', link: '/testing', items: [
        { text: 'Unit testing', link: '/testing/unit-testing' },
        { text: 'E2E testing', link: '/testing/e2e-testing' },
        { text: 'Integration testing', link: '/testing/integration-testing' },
        ]
      },
      { text: 'Project structure', link: '/project-structure'},
      { text: 'ESLint config', link: '/eslint-config'},
      { text: 'Clean code', link: '/clean-code'},
      { text: 'Teamwork', link: '/teamwork'},
      { text: 'Tools', link: '/tools'},
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/appwise-labs/frontend-bible' }
    ]
  }
})
