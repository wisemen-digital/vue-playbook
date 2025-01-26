#### [Reusable Code](/reusable-code.md)

# Transformers

Transformers are used to transform data from one format to another.
This can be useful when you want to transform data from the backend to a format that is more suitable for your frontend.

Transformers are classes that make use of static methods to transform data.

# Best practices:

- Use static methods to transform data
- Use the same name for the transformer as the class you are transforming (e.g. `CustomerIndexTransformer` for `CustomerIndex` or `CustomerDetailTransformer` for `CustomerDetail`)
- Use a `fromdto` method to transform data from a DTO to a model
- Use a `todto` method to transform data from a model to a DTO
- Use a `toForm` method to transform data from a model to a form

✅ Good example of a transformer function

```typescript
export class CustomerIndexTransformer {
    static fromdto(customerIndexDto: CustomerIndexDto): CustomerIndex {
        return {
            uuid: customerIndexDto.uuid,
            name: customerIndexDto.name,
            email: customerIndexDto.email,
            phone: PhoneNumberTransformer.fromdto(customerIndexDto.phone),
            address: AddressTransformer.fromdto(customerIndexDto.address),
            createdAt: DateTransformer.fromdto(customerIndexDto.createdAt),
            updatedAt: DateTransformer.fromdto(customerIndexDto.updatedAt),
        }
    }
}

export class CustomerDetailTransformer {
    static fromdto(customerDetailDto: CustomerDetailDto): CustomerDetail {
        return {
            uuid: customerDetailDto.uuid,
            name: customerDetailDto.name,
            email: customerDetailDto.email,
            phone: PhoneNumberTransformer.fromdto(customerDetailDto.phone),
            address: AddressTransformer.fromdto(customerDetailDto.address),
            createdAt: DateTransformer.fromdto(customerDetailDto.createdAt),
            updatedAt: DateTransformer.fromdto(customerDetailDto.updatedAt),
        }
    }
}

export class CustomerCreateTransformer {
    static todto(customerCreate: CustomerCreate): CustomerCreateDto {
        return {
            name: customerCreate.name,
            email: customerCreate.email,
            phone: PhoneNumberTransformer.todto(customerCreate.phone),
            address: AddressTransformer.todto(customerCreate.address),
        }
    }
}

export class CustomerUpdateTransformer {
    static todto(customerUpdate: CustomerUpdate): CustomerUpdateDto {
        return {
            uuid: customerUpdate.uuid,
            name: customerUpdate.name,
            email: customerUpdate.email,
            phone: PhoneNumberTransformer.todto(customerUpdate.phone),
            address: AddressTransformer.todto(customerUpdate.address),
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
