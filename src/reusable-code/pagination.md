#### [Reusable Code](/reusable-code.md)

# Pagination

 * Pagination is a technique used to divide large datasets into smaller,
 * manageable chunks (pages) instead of loading everything at once.
 * It improves performance, reduces server load, and enhances user experience
 * by allowing data to be requested and displayed in parts.
 * This interface represents the structure required to request paginated data
 * from an API, including sorting and filtering capabilities.

```typescript
interface Pagination<TFilter> {
  page: number
  perPage: number
  sort: 'asc' | 'desc'
  filter: {
    [key: keyof TFilter]: string | number | boolean | string[]
  }
}
```
@template TFilter : Defines the shape of the filter object specific to the resource.

