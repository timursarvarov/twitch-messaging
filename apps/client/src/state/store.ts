import { Action, configureStore } from '@reduxjs/toolkit';
import app from '../components/App/App.slice';
import login from '../components/Pages/Login/Login.slice';
import register from '../components/Pages/Register/Register.slice';


const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { login, app, register },
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
