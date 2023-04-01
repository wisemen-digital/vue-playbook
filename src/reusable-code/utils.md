#### [Reusable Code](/reusable-code.md)

# Utils

Utils are reusable pieces of logic that are not specific to vue and never contain any state. A good example is
the `dates.util.ts`. Each function is
exported as a const and does not share state with the other functions.

✅ Good example of a helper function

```typescript
import dayjs from "@/helpers/dayjs";

export const hasDate = (date: DateType | string): boolean => date !== "-";

export const formatDate = (date: DateType | string) => {
  return dayjs(date).format("DD/MM/YYYY");
};
```

✅ Very bad and naught example of a helper function

```typescript

export const saveToDatabase = () => {
  
}
```
