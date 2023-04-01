# Components - Props

Props are the input of a component. They are used to pass data to the component.
These props are immutable and can't be changed by the component itself
(unless you configure them as model props).

## Typescript constructor

Use the Typescript constructor to define your props.
This will give you the best intellisense and type checking.

```typescript
const props = defineProps<{
  name: string,
  age: number,
  address: Address,
}>();
```

## No default values (TODO: discuss this)

When using the typescript constructor, you can't define default values.
This is a good thing. It forces you to always pass a value to avoid unexpected behaviour.

If you have a prop that has a prop that determines it's styling or functionality.
Make the user of your component required to pass that prop.

```typescript
enum Shape {
  Circle,
  Square,
}

const props = defineProps<{
  shape: Shape,
}>();
```

## Boolean props should be prefixed

Prefixing props with `is` or `has` makes it clear that the prop is a flag that expects a boolean value.

```typescript
const props = defineProps<{
  isDisabled: boolean,
  hasError: boolean,
  isVisible: boolean,
  hasContainer: boolean,
}>();
```

## Optional flags should always be false by default

When you have an optional boolean prop, it's good practice to set it default to false.

- This will prevent you from having to write inverted logic.
- This makes it clear for the user of your component that the prop is optional and that it's default value is false.

```typescript
const props = defineProps<{
  isDisabled?: boolean,
  hasError?: boolean,
}>();
```
