# Writing components for dummies
Components are the building blocks of your application. They are the most important part of your application and should be written with care.

### Table of contents
- [Naming conventions](#naming-conventions)
- [Structure](#structure)
- [Smart vs Dumb components](#smart-vs-dumb-components)
- [Props](components/components-props.md)
- [Emits](components/components-emits.md)
- [Slots](components/components-slots.md)

## Naming conventions
When naming your components, you should always follow these conventions.

### 1. Use PascalCase
Use PascalCase for naming your components. This will make it easier to read and will prevent conflicts with HTML elements.

```vue
<template>
    <ExampleComponent />
</template>
```

### 2. Use long names
Use long names for your components. This will make it easier to understand what the component is for.

>A good practice is to follow your folder structure. This will make it easier to find the component you are looking for.

Example:
```vue
<template>
    <EmployeeDetailEmploymentView />
</template>
```

### 3. Use the component type as a suffix
Use the component type as a suffix. This will make it easier to understand what the component is for.

Example:
```vue
<template>
    <FormDropdown />
    <FormCurrencyInput />
    <FormSelectButton />
</template>
```

### 4. Prefix with the module name
Use the folder or module name to prefix your component. This is especially useful when creating a library of components.

Example:
```vue
<template>
    <AppButton />
    <AppGrid />
    <FormDropdown />
    <FormCurrencyInput />
</template>
```

## Structure
When writing components, you should always follow this structure.

1. Imports `import { defineProps, defineEmits } from 'vue';`
2. Props `const props = defineProps<{value: Person}>();`
3. Emits `const emit = defineEmits<{(e: 'change', value: Person)}>();`
4. Composable `const { isLoading } = useLoading()`
5. Refs `const isLoading = ref<boolean>(false)`
6. Computed properties `const isLoading = computed<boolean>(() => {})`
7. Methods `initForm() {}`
8. Lifecycle hooks `onMounted(() => {})`
9. defineExpose `defineExpose({})`
10. Template `<template>`
11. Styles `<style scoped>`

## Smart vs Dumb components

>When writing components, you should always try to split them into smart and dumb components.
This will make your components easier to understand and maintain when adding or changing functionality.

### Smart components (container)
Smart components are usually the "views" of your application and are rendered by the router. They are responsible for handling user interaction and passing data to dumb components.

- Imports all of your stores, router, services, ... 
- Contain heavy business logic 
- Contain little to no presentation logic in their template 
- Are focused on passing data to dumb components 
- Are focused on handling emits from dumb components

### Dumb components (presentational)
Dumb components are usually rendered by smart components. They are responsible for rendering data and emitting events.

- Pure input & output (props & emits)
- Never contain any import of a router, store, service, ... 
   - This will prevent them from being dependent on the context they are used in 
   - This will make them easier to test, reuse and understand 
- Are focused on rendering data, handling user interaction and emitting events

### Props
Props are the input of a component. They are used to pass data to the component. These props are immutable and can't be changed by the component itself (unless you configure them as model props).

[Read more about props](components/components-props.md)

### Emits
Emits are the output of a component. They are used to pass data from the component to the parent. These emits are immutable and can't be changed by the component itself.

[Read more about emits](components/components-emits.md)

### Slots
Slots are used to pass content to a component. This content can be anything, from text to other components.

[Read more about slots](components/components-slots.md)

### HTML tags

- `<section>This is used as a wrapper for big pieces of code</section>`
- `<article>This is used as a wrapper for a single item in a section</article>`
- h1, h2, h3,
- `<p>This is used for text and paragraphs</p>`
- `<span>Text</span>`
- `<a href='www.usemeforlinks.please'>`


