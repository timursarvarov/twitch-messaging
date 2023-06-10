import axios from 'axios';
import {
  HashRouter,
  Navigate,
  Route,
  RouteProps,
  Routes,
} from 'react-router-dom';
import { getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Header } from '../Header/Header';
import Chat from '../Pages/Chat/Chat';
import { Login } from '../Pages/Login/Login';
import { Register } from '../Pages/Register/Register';
import { endLoad, loadUser } from './App.slice';

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user !== null;

  return (
    <HashRouter>
      {!loading && (
        <>
          <Header />
          {user?.username}
          <Routes>
            <Route
              path="/signin"
              element={
                <GuestOnlyRoute userIsLogged={!!user}>
                  <Login />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestOnlyRoute userIsLogged={!!user}>
                  <Register />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/"
              element={
                <UserOnlyRoute userIsLogged={!!user}>
                  <Chat />
                </UserOnlyRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </HashRouter>
  );
}

async function load() {
  const token = await localStorage.getItem('token');

  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;

  try {
    store.dispatch(loadUser(await getUser()));
  } catch {
    store.dispatch(endLoad());
  }
}

function GuestOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: {
  children: JSX.Element | JSX.Element[];
  userIsLogged: boolean;
} & RouteProps) {
  return userIsLogged ? <Navigate to="/" replace /> : <>{children}</>;
}

/* istanbul ignore next */
function UserOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: {
  children: JSX.Element | JSX.Element[];
  userIsLogged: boolean;
} & RouteProps) {
  return !userIsLogged ? <Navigate to="/" replace /> : <>{children}</>;
}
