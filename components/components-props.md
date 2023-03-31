# Components - Props

Props are the input of a component. They are used to pass data to the component. These props are immutable and can't be changed by the component itself (unless you configure them as model props).

For defining props there are a few best practices to follow. 

## 1. Typescript constructor
```typescript
const props = defineProps<{
  name: string,
  age: number,
  address: Address,
}>();
```

## 2. No default values
When using the typescript constructor, you can't define default values. This is a good thing. It forces you to always pass a value to avoid unexpected behaviour.

If you have a prop that has a prop that determines it's styling or functionality. Make the user of your component required to pass that prop. 

```typescript
enum Shape {
  Circle,
  Square,
}

const props = defineProps<{
  shape: Shape,
}>();
```

## 3. Flags should be prefixed with `is` or `has`
Prefixing flags with `is` or `has` makes it clear that the prop is a flag. This will make it easier to read the code.

```typescript
const props = defineProps<{
  isDisabled: boolean,
  hasError: boolean,
}>();
```

## 4. Optional flags should always be false
Optional flags should always be false. This will make it easier to read the code and will prevent unexpected behaviour.
This will also prevent you from having to check if the prop is undefined and write inverted logic.

```typescript
const props = defineProps<{
  isDisabled?: boolean,
  hasError?: boolean,
}>();
```
