# Services

Services are used to fetch data from the backend. They are used in the stores and in the components.

## Responsibility of a service

- Fetching data from the backend
- Transforming and mapping data

## Example

This is an example of a well written service.

```typescript
export class OfficesService {
  getAll(): AxiosPromise<Office[]> {
    return httpClient.get('offices')
  }

  getById(officeUuid: string): AxiosPromise<Office> {
    return httpClient.get(`offices/${officeUuid}`)
  }

  create(officeForm: OfficeForm): AxiosPromise<Office> {
    return httpClient.post('offices', mapOfficeFormToDto(officeForm))
  }

  update(officeUuid: string, officeForm: OfficeForm): AxiosPromise<Office> {
    return httpClient.post(`offices/${officeUuid}`, mapOfficeFormToDto(officeForm))
  }

  delete(officeUuid: string): AxiosPromise<Office> {
    return httpClient.delete(`offices/${officeUuid}`)
  }
}
```
