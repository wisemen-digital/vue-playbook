import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search";

var options = {
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs",
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WisemenFrontendBible",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      { text: 'Components', link: '/components', items: [
          { text: 'Props', link: '/components/components-props' },
          { text: 'Emits', link: '/components/components-emits' },
          { text: 'Slots', link: '/components/components-slots' },
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
      { text: 'Libraries', link: '/libraries'},
      { text: 'Naming conventions', link: '/naming-conventions'},
      { text: 'Composables', link: '/composables'},
      { text: 'Testing', link: '/testing'},
      { text: 'Project structure', link: '/project-structure'},
      { text: 'ESLint config', link: '/eslint-config'},
      { text: 'Utils', link: '/utils'},
      { text: 'Teamwork', link: '/teamwork'},
      { text: 'Tools', link: '/tools'},
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
