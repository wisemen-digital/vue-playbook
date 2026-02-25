#### [Reusable Code](/reusable-code.md)

# Router (WIP)

The router is a Vue Router instance that is used to navigate between pages.

```typescript
export const routerIndex = [
  {
    path: '/example', // The base URL path for this route group
    children: [ // Defines nested routes under /example
      {
        name: 'example-overview', // Used for programmatic navigation (router.push({ name: 'example-overview' }))
        path: '', //Empty path means this is the default child route , So visiting /example will automatically load this component
        component: (): Component =>
          import('@/modules/example/use-cases/overview/views/ExampleOverviewView.vue'), //The component is only imported when the route is visited
        meta: {  // Meta object for attaching extra information to the route
          permission: 'example.read',
        },
      },
    ],
  },
] as const satisfies RouteRecordRaw[]
```