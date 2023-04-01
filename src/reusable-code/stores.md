#### [Reusable Code](/reusable-code.md)

# Stores

Stores are used to store data that is shared between multiple components in your application.

## Responsibility of a store

- Fetching data from the backend using a service
- Storing data locally
- Managing the loading state

## Example

This is an example of a well written store.

```typescript
// office.store.ts
export const useOfficeStore = defineStore('OfficeStore', () => {

  const offices = useLocalStorage<Office[]>('offices', [])

  const { isSaving, setSavingStatus } = useSaving()
  const { isLoading, setLoadingState } = useLoading()
  
  const officesService = new OfficesService()

  const fetchOffices = async (): Promise<void> => {
    try {
      setLoadingState(true)
      const response = await officesService.getAll()
      offices.value = response.data
    } finally {
      setLoadingState(false)
    }
  }

  const fetchOfficeById = async (officeUuid: string): Promise<Office> => {
    try {
      setLoadingState(true)
      const response = await officesService.getById(officeUuid)
      return response.data;
    } finally {
      setLoadingState(false)
    }
  }

  const create = async (officeForm: OfficeForm): Promise<Office> => {
    try {
      setSavingStatus(true)
      const response = await officesService.create(officeForm)
      offices.value.push(response.data)
      return response.data
    } finally {
      setSavingStatus(false)
    }
  }

  const update = async (officeUuid: string, officeForm: OfficeForm): Promise<Office> => {
    try {
      setSavingStatus(true)
      const response = await officesService.update(officeUuid, officeForm)
      return response.data
    } finally {
      setSavingStatus(false)
    }
  }
  
  return {
    offices,
    isSaving,
    isLoading,
    fetchOffices,
    fetchOfficeById,
    update,
    create,
  }
})
```
