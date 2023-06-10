import { UserForSignUpReq } from '@twitch-messaging/shared';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../state/storeHooks';

export function Header() {
  const { user } = useStore(({ app }) => app);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <ul className="nav navbar-nav pull-xs-right">
          <NavItem text="Home" href="/" />
          {user ? <UserLinks user={user} /> : <GuestLinks />}
        </ul>
      </div>
    </nav>
  );
}

function NavItem({
  text,
  href,
  icon,
}: {
  text: string;
  href: string;
  icon?: string;
}) {
  return (
    <li className="nav-item">
      <NavLink to={href} className="nav-link">
        {icon && <i className={icon}></i>}&nbsp;
        {text}
      </NavLink>
    </li>
  );
}

function GuestLinks() {
  return (
    <Fragment>
      <NavItem text="Sign in" href="/signin" />
      <NavItem text="Sign up" href="/signup" />
    </Fragment>
  );
}

function UserLinks({ user: { username } }: { user: UserForSignUpReq }) {
  return <NavItem text={`${username}`} href={`/profile/${username}`} />;
}
