import { GenericErrors } from '../../../types/error';
import { signUp } from '../../../services/conduit';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { buildGenericFormField } from '../../../types/genericFormField';
import { User, UserForRegistration, loadUserIntoApp } from '../../../types/user';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { GenericForm } from '../../GenericForm/GenericForm';
import {
  RegisterState,
  initializeRegister,
  startSigningUp,
  updateErrors,
  updateField,
} from './Register.slice';

export function Register() {
  const { errors, signingUp, user } = useStoreWithInitializer(
    ({ register }) => register,
    dispatchOnCall(initializeRegister())
  );

  return (
    <div className="auth-page">
      <ContainerPage>
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign up</h1>
          <p className="text-xs-center">
            <a href="/#/login">Have an account?</a>
          </p>

          <GenericForm
            disabled={signingUp}
            formObject={user as unknown as Record<string, string>}
            submitButtonText="Sign up"
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onSignUp(user)}
            fields={[
              buildGenericFormField({
                name: 'username',
                placeholder: 'Username',
              }),
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
    updateField({ name: name as keyof RegisterState['user'], value })
  );
}

function onSignUp(user: UserForRegistration) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startSigningUp());
    const result = await signUp(user);

    console.log(result);

    if (result instanceof Error) {
      store.dispatch(updateErrors(result as GenericErrors));
    } else {
      // eslint-disable-next-line no-restricted-globals
      location.hash = '#/';
      loadUserIntoApp(result as User);
    }

  
  };
}
