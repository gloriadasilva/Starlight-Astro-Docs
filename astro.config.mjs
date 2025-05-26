import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Vue.js',
      logo: {
        src: './src/assets/vuejs.png',

      },

      customCss: [
        // Relative path to your custom CSS file
        './src/styles/index.css'
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Vue Component', slug: 'getting-started/component-basics' },
            {label: 'Quick Start', slug: 'getting-started/quickstart'},
          ],

        },
        {
          label: 'Essentials',
          items:[
            { label: 'Create Vue Application', slug: 'essentials/create-vue-application'},
            { label:'Template Syntax', slug: 'essentials/template-syntax'},
            {label: 'Reactivity Fundamentals', slug: 'essentials/reactivity-fundamentals'},
            {label: 'Computed Properties', slug: 'essentials/computed-properties'},
            {label: 'Class and Style Bindings', slug: 'essentials/class-and-style-bindings'},
          ]

        },
        {
          label: 'Component In-Depth',
          items:[
            {
              label: 'Component Registration', slug:'component-indepth/component-registration'
            },
            {
              label:'Props', slug:'component-indepth/props'
            },
            {
              label: 'Component Events', slug: 'component-indepth/event'
            },
            {
              label: 'Component v-model', slug: 'component-indepth/component-model'
            },
            {
              label: 'Fallthrough Attributes', slug: 'component-indepth/fallthrough-attributes'
            },
          ]

        },
        {
          label: 'Reusability',
          items:[
            {label: 'Composables', slug: 'reusability/composables'},
            {label: 'Custom Directives', slug: 'reusability/custom-directives'},
            {label: 'Plugins', slug: 'reusability/plugins'},
          ]
        },
        {
          label: 'Built-in Component',
          items:[
            {
              label: 'Transition', slug: 'builtin-component/transition'
            },
            {
              label: 'Transition Group', slug: 'builtin-component/transition-group'
            },
            {
              label: 'KeepAlive', slug: 'builtin-component/keepalive'
            },
            {
              label: 'Teleport', slug: 'builtin-component/teleport'
            },
            {
              label: 'Suspense', slug: 'builtin-component/suspense'
            }
          ]
        },
      ],
    }),
    vue(),
  ],
});
