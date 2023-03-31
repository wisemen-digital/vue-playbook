# Components - Emits

Emits are the output of a component. They are used to pass data from the component to the parent. These emits are immutable and can't be changed by the component itself.

For defining emits there are a few best practices to follow.

## 1. Typescript constructor
Use the Typescript constructor to define your emits. This will give you the best intellisense and type checking.

```typescript
const emit = defineEmits<{(e: 'change', value: Person)}>();
```

## 2. Prefix them when they overlap with existing events
When you have a component that emits an event that is already used by the browser, you should prefix it. This will prevent conflicts with the browser.

```typescript
const emit = defineEmits<{
  (e: 'component:click', value: Person),
  (e: 'row:click', value: Person),
}>();
```

## 3. Use verbs
Use verbs to name your emits. This will make it clear what the emit is for.

```typescript
const emit = defineEmits<{
  (e: 'change', value: Person),
  (e: 'click', value: Person),
}>();
```

## 4. Handling emits in the parents
When handling emits in the parent, you should always use the `on` or 'handle' prefix. This will make it clear that you are handling an emit.

```vue
<template>
    <ExampleComponent @component:change="handleChange" />
</template>
```
