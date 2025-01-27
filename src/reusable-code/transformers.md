#### [Reusable Code](/reusable-code.md)

# Transformers

Transformers are used to transform data from one format to another.
This can be useful when you want to transform data from the backend to a format that is more suitable for your frontend.

Transformers are classes that make use of static methods to transform data.

# Best practices:

- Use static methods to transform data
- Use the same name for the transformer as the class you are transforming (e.g. `CustomerIndexTransformer` for `CustomerIndex` or `CustomerDetailTransformer` for `CustomerDetail`)
- Use a `fromDto` method to transform data from a DTO to a model
- Use a `toDto` method to transform data from a model to a DTO
- Use a `toForm` method to transform data from a model to a form

✅ Good example of a transformer function

```typescript
export class CustomerIndexTransformer {
    static fromDto(customerIndexDto: CustomerIndexDto): CustomerIndex {
        return {
            uuid: customerIndexDto.uuid,
            name: customerIndexDto.name,
            email: customerIndexDto.email,
            phone: PhoneNumberTransformer.fromDto(customerIndexDto.phone),
            address: AddressTransformer.fromDto(customerIndexDto.address),
            createdAt: DateTransformer.fromDto(customerIndexDto.createdAt),
            updatedAt: DateTransformer.fromDto(customerIndexDto.updatedAt),
        }
    }
}

export class CustomerDetailTransformer {
    static fromDto(customerDetailDto: CustomerDetailDto): CustomerDetail {
        return {
            uuid: customerDetailDto.uuid,
            name: customerDetailDto.name,
            email: customerDetailDto.email,
            phone: PhoneNumberTransformer.fromDto(customerDetailDto.phone),
            address: AddressTransformer.fromDto(customerDetailDto.address),
            createdAt: DateTransformer.fromDto(customerDetailDto.createdAt),
            updatedAt: DateTransformer.fromDto(customerDetailDto.updatedAt),
        }
    }
}

export class CustomerCreateTransformer {
    static toDto(customerCreate: CustomerCreate): CustomerCreateDto {
        return {
            name: customerCreate.name,
            email: customerCreate.email,
            phone: PhoneNumberTransformer.toDto(customerCreate.phone),
            address: AddressTransformer.toDto(customerCreate.address),
        }
    }
}

export class CustomerUpdateTransformer {
    static toDto(customerUpdate: CustomerUpdate): CustomerUpdateDto {
        return {
            uuid: customerUpdate.uuid,
            name: customerUpdate.name,
            email: customerUpdate.email,
            phone: PhoneNumberTransformer.toDto(customerUpdate.phone),
            address: AddressTransformer.toDto(customerUpdate.address),
        }
    }
    
    static toForm(customerDetail: CustomerDetail): CustomerUpdateForm {
        return {
            uuid: customerDetail.uuid,
            name: customerDetail.name,
            email: customerDetail.email,
            phone: PhoneNumberTransformer.toForm(customerDetail.phone),
            address: AddressTransformer.toForm(customerDetail.address),
        }
    }
       
}
```
