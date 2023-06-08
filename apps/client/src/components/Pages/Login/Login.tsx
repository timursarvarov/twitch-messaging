import React from 'react';
import { login } from '../../../services/conduit';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { buildGenericFormField } from '../../../types/genericFormField';
import { User, loadUserIntoApp } from '../../../types/user';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { GenericForm } from '../../GenericForm/GenericForm';
import {
  LoginState,
  initializeLogin,
  startLoginIn,
  updateErrors,
  updateField,
} from './Login.slice';
import { GenericErrors } from '../../../types/error';

export function Login() {
  const { errors, loginIn, user } = useStoreWithInitializer(
    ({ login }) => login,
    dispatchOnCall(initializeLogin())
  );

  return (
    <div className="auth-page">
      <ContainerPage>
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign in</h1>
          <p className="text-xs-center">
            <a href="/#/register">Need an account?</a>
          </p>

          <GenericForm
            disabled={loginIn}
            formObject={user}
            submitButtonText="Sign in"
            errors={errors}
            onChange={onUpdateField}
            onSubmit={signIn}
            fields={[
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({
                name: 'password',
                placeholder: 'Password',
                type: 'password',
              }),
            ]}
          />
        </div>
      </ContainerPage>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(
    updateField({ name: name as keyof LoginState['user'], value })
  );
}

async function signIn(ev: React.FormEvent) {
  ev.preventDefault();

  if (store.getState().login.loginIn) return;
  store.dispatch(startLoginIn());

  const { email, password } = store.getState().login.user;
  const result = await login(email, password);

  if (result instanceof Error) {
    store.dispatch(updateErrors(result as GenericErrors));
  } else {
    // eslint-disable-next-line no-restricted-globals
    location.hash = '#/';
    loadUserIntoApp(result as User);
  }
}
