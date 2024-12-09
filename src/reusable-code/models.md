#### [Reusable Code](/reusable-code.md)

# Models

Models are used to define the shape of data in your application. We use Zod to make our models as it offers an extra check on top of TypeScript.

we define or name or as followed:

index schema: `customerIndexSchema`
index dto schema: `customerIndexDtoSchema`

detail schema: `customerDetailSchema`
detail dto schema: `customerDetailDtoSchema`

in a folder it will be like this:

```
models
└── customer
├── index
│   ├── customerIndexSchema.ts
│   └── customerIndexDtoSchema.ts
├── detail
│   ├── customerDetailSchema.ts
│   └── customerDetailDtoSchema.ts
├── create
├── update
├── customerUuidSchema.ts
└── customer.transformer.ts
```


Here is an example of a model:

```typescript
const customerIndexSchema = z.object({
    uuid: customerUuidSchema,
    name: z.string(),
    email: z.string(),
    phone: phoneNumberSchema,
    address: addressSchema,
    createdAt: dateSchema,
    updatedAt: dateSchema, 
});

export type CustomerIndexDto = z.infer<typeof customerIndexDtoSchema>;
```

Here is an example of a Dto model:

```typescript
const customerIndexDtoSchema = z.object({ // while defining the dto model we use 'Schema'
  uuid: customerUuidSchema,
  name: z.string(),
  email: z.string(),
  phone: phoneNumberDtoSchema,
  address: addressDtoSchema,
  createdAt: dateDtoSchema, // in the dto model we use the dto schema
  updatedAt: dateDtoSchema,
});

export type CustomerIndexDto = z.infer<typeof customerIndexDtoSchema>;
```
