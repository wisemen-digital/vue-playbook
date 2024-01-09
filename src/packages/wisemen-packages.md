#### [Packages](/packages.md)


# OAuth package

## Installation

```bash
pnpm install @appwise/oauth2-vue-client
```

## Usage

1. Create a new file in your `/src`  folder called `oAuthClient.ts`  or somewhere else in your application where you keep track of your libraries. With the following content
    
```typescript
import { OAuthClient } from '@appwise/oauth2-vue-client'

const { VITE_CLIENT_ID, VITE_CLIENT_SECRET, VITE_BASE_NODE_URL } = import.meta.env

export const oAuthClient = new OAuthClient({
	clientId: VITE_CLIENT_ID,
	clientSecret: VITE_CLIENT_SECRET,
	tokenEndpoint: `${VITE_BASE_NODE_URL}/auth/token`,
})
```

2. Create a store called `auth.store.ts` with the following content:

- A function to get the current user
- A function to set the current user
- A function to check if the user is logged in
- A function to login
- A function to logout

3. Interceptor to add the token to the request

- Add request interceptor to add the token to the request. Import and provide the client you created in step 1 to `addAuthorizationHeader()` 

```typescript
axios.interceptors.request.use(config => addAuthorizationHeader(oAuthClient, config))
```
- Add response interceptor to handle 401 errors. It should look something like this:

```typescript
axios.interceptors.response.use(
  config => config,
  async (error) => {
    if (!Axios.isAxiosError(error))
      return Promise.reject(error)

    const status = error.response?.status ?? null

    if (status === 401) {
      const currentUserStore = useCurrentUserStore()
      currentUserStore.logout()

      await router.replace({
        name: 'YOUR LOGIN PAGE',
      })
    }

    return Promise.reject(error)
  },
)
```

4. add router middleware
- Check for each authenticated route if the user is authenticated by using the function authStore.getCurrentUser() created in step 2.



