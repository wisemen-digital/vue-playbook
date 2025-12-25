#### [Components](/components.md)

# Portals

Portals (using Vue's `<Teleport>` component) allow you to render content in a different part of the DOM tree, outside of your component's normal hierarchy. This is useful for modals, tooltips, notifications, and other UI elements that need to break out of their parent's styling constraints.

## When to use portals

Use portals when you need to render content that should appear above other elements or escape CSS constraints like `overflow: hidden` or `z-index` stacking contexts.

> Most of the time your components work fine within their normal DOM hierarchy. Only use portals when you have a specific need to render content elsewhere in the DOM.

## Basic portal usage

The most common use case is rendering modals and dialogs at the document body level to avoid positioning and z-index issues.

```vue
<template>
  <div>
    <button @click="showModal = true">
      Open Modal
    </button>
    
    <Teleport to="body">
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg">
          <h2>Modal Title</h2>
          <p>Modal content goes here</p>
          <button @click="showModal = false">
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>
```

## Portal to specific elements

You can teleport content to any element in the DOM by using a CSS selector. This is useful for rendering content in specific portal containers.

```vue
<template>
  <Teleport to="#notification-container">
    <div class="notification">
      {{ message }}
    </div>
  </Teleport>
</template>
```

Make sure the target element exists in your HTML:

```html
<div id="app"></div>
<div id="notification-container"></div>
```

## Disable portals conditionally

You can disable the teleport behavior conditionally, which is useful for testing or specific rendering scenarios.

```vue
<template>
  <Teleport 
    to="body" 
    :disabled="!shouldTeleport"
  >
    <div class="tooltip">
      {{ tooltipText }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const shouldTeleport = ref(true)
</script>
```

## Multiple portals to the same target

You can have multiple components teleporting to the same target. They will be appended in the order they are rendered.

```vue
<template>
  <div>
    <Teleport to="#modals">
      <ConfirmDialog v-if="showConfirm" />
    </Teleport>
    
    <Teleport to="#modals">
      <AlertDialog v-if="showAlert" />
    </Teleport>
  </div>
</template>
```

## Best practices

Keep your portal targets simple and predictable. Create dedicated portal containers in your main HTML file for different types of content (modals, notifications, tooltips).

Always check that the target element exists before rendering, especially when using custom selectors. The teleport will fail silently if the target doesn't exist.

Use portals sparingly. They break the normal component hierarchy and can make debugging more difficult. Only use them when you have a clear need to render content outside the normal flow.