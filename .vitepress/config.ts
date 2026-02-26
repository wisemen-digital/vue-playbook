import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Vue Playbook",
  vite: {
    plugins: []
  },
  srcDir: 'src',
  dir: 'src',
  cleanUrls: true,
  lastUpdated: true,
  description: "The Vue Playbook is a collection of best practices, design patterns, and libraries for building Vue.js applications.",
  base: '/vue-playbook/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Team', link: '/team' },
    ],
    editLink: {
      pattern: 'https://github.com/wisemen-digital/vue-playbook/blob/main/src/:path'
    },
    logo: '/bible_logo.png',
    sidebar: [
      { text: 'Project template', link: '/project-template'},
      { text: 'Tools', link: '/tools'},
      { text: 'Project structure', link: '/project-structure'},
      { text: 'Clean code', link: '/clean-code'},
      { text: 'Naming conventions', link: '/naming-conventions'},
      { text: 'ESLint config', link: '/eslint-config'},
      { text: 'Teamwork', link: '/teamwork'},
      { text: 'Libraries', link: '/libraries'},
      { text: 'Components', link: '/components', items: [
          { text: 'Naming', link: '/components/naming' },
          { text: 'Structure', link: '/components/structure' },
          { text: 'Smart vs Dumb', link: '/components/smart-dumb' },
          { text: 'Props', link: '/components/props' },
          { text: 'Emits', link: '/components/emits' },
          { text: 'Slots', link: '/components/slots' },
          { text: 'Accessibility', link: '/components/accessibility' },
        ]
      },
      { text: 'Reusable code', link: '/reusable-code', items: [
          { text: 'Composables', link: '/reusable-code/composables' },
          { text: 'Utils', link: '/reusable-code/utils' },
          { text: 'Stores', link: '/reusable-code/stores' },
          { text: 'Services', link: '/reusable-code/services' },
          { text: 'Queries', link: '/reusable-code/queries' },
          { text: 'Models', link: '/reusable-code/models' },
          { text: 'Transformers', link: '/reusable-code/transformers' },
          { text: 'Pagination', link: '/reusable-code/pagination' },
          { text: 'Mutations', link: '/reusable-code/mutations' },
          { text: 'Router', link: '/reusable-code/router' },
          { text: 'Authentication', link: '/reusable-code/authentication' },
      ]},
      { text: 'Testing', link: '/testing', items: [
        { text: 'Unit testing', link: '/testing/unit-testing' },
        { text: 'E2E testing', link: '/e2e-testing' },
        { text: 'Integration testing', link: '/testing/integration-testing' },
        ]
      },
      { text: 'E2E Testing', link: '/e2e-testing', items: [
          { text: 'Getting Started', link: '/e2e-testing/getting-started' },
          { text: 'Architecture', link: '/e2e-testing/architecture' },
          { text: 'Configuration', link: '/e2e-testing/configuration' },
          { text: 'Writing Tests', link: '/e2e-testing/writing-tests' },
          { text: 'Fixtures & Setup', link: '/e2e-testing/fixtures-and-setup' },
          { text: 'API Mocking', link: '/e2e-testing/api-mocking' },
          { text: 'Test Utilities', link: '/e2e-testing/test-utilities' },
          { text: 'Test Data Builders', link: '/e2e-testing/test-data-builders' },
          { text: 'Accessibility Testing', link: '/e2e-testing/accessibility-testing' },
          { text: 'Common Pitfalls', link: '/e2e-testing/common-pitfalls' },
          { text: 'Best Practices', link: '/e2e-testing/best-practices' },
          { text: 'Debugging', link: '/e2e-testing/debugging' },
          { text: 'CI & Coverage', link: '/e2e-testing/ci-and-coverage' },
        ]
      },
      {
        text: 'Design patterns', link: '/design-patterns', items: [
          {text: 'Solid', link: '/design-patterns/solid' },
          {text: 'Builder pattern', link: '/design-patterns/builder-pattern' },
        ],
      },
      {
        text: 'Packages', link: '/packages', items: [
          {text: 'oAuth client', link: '/packages/o-auth-client' },
        ],
      },
      { 
        text: 'Accessibility', 
        link: '/accessibility', 
        items: [
          { 
            text: 'Semantic HTML', 
            link: '/accessibility/semantic-html',
          },
          { 
            text: 'Visual elements', 
            link: '/accessibility/visual-elements',
          },
          { 
            text: 'Typography', 
            link: '/accessibility/typography',
          },
          { 
            text: 'Images & icons', 
            link: '/accessibility/images-and-icons',
          },
          { 
            text: 'Keyboard Navigation & Focus Management', 
            link: '/accessibility/keyboard-navigation-and-focus-management',
          },
          { 
            text: 'ARIA', 
            link: '/accessibility/aria',
          },
          { 
            text: 'Color & Contrast', 
            link: '/accessibility/color-and-contrast',
          },
          { 
            text: 'Forms & inputs', 
            link: '/accessibility/forms-and-inputs',
          },
          { 
            text: 'Navigation', 
            link: '/accessibility/navigation',
          },
          { 
            text: 'Animations', 
            link: '/accessibility/animations',
          },
          { 
            text: 'Responsive & mobile accessibility', 
            link: '/accessibility/responsive-and-mobile',
          },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wisemen-digital/vue-playbook' }
    ]
  }
})
