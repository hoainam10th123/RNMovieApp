import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import presenceHubReducer from './reducers/presenceHubReducer'

export const store = configureStore({
  reducer: {
    user : userReducer,
    presenceHub: presenceHubReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['hubs/presence/createHubConnection', 'hubs/presence/stopHubConnetion'],
        ignoredActionPaths: ['payload.hubConnection'],
        ignoredPaths: ['presenceHub.hubConnection'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch