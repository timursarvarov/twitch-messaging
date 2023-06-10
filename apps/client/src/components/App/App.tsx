import axios from 'axios';
import { Fragment } from 'react';
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
import { Footer } from '../Footer/Footer';
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
        <Fragment>
          <Header />
          <Routes>
            <Route
              path="/login"
              element={
                <GuestOnlyRoute userIsLogged={userIsLogged}>
                  <Login />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnlyRoute userIsLogged={userIsLogged}>
                  <Register />
                </GuestOnlyRoute>
              }
            />
            <Route path="/" element={<Chat />}></Route>

            <Route path="*" element={<Navigate to="/" replace />}></Route>
          </Routes>
          <Footer />
        </Fragment>
      )}
    </HashRouter>
  );
}

async function load() {
  const token = localStorage.getItem('token');
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

/* istanbul ignore next */
function GuestOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: {
  children: JSX.Element | JSX.Element[];
  userIsLogged: boolean;
} & RouteProps) {
  return userIsLogged ? <Navigate to="/" replace /> : children;
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
  return !userIsLogged ? <Navigate to="/" replace /> : children;
}
