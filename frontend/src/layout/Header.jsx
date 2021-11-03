import logo from '../assets/images/icon.svg';
import AdminMenu from '../components/AdminMenu';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = () => {
  const title = 'Groupomania';
  const location = useLocation();
  const [isMoved, setMove] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const postsSection = currentUser ? <AdminMenu /> : null;

  const toggleClass = () => {
    setMove(!isMoved);
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.assign('/login');
  };

  const appear =
    location.pathname === '/signup' ||
    location.pathname === '/login' ||
    location.pathname === '/'
      ? 'disappear'
      : '';
  return (
    <header className="header">
      <div className="header__name">
        <img
          src={logo}
          alt="logo du site groupomania"
          className="header__name__logo"
        />
        <h1 className="header__name__title">{title}</h1>
      </div>
      <div className={`header__menu ${appear}`}>
        <div className="header__menu__area">
          <FontAwesomeIcon
            icon={faUser}
            className="header__menu__area__icon"
            onClick={toggleClass}
          />
        </div>
      </div>
      <nav className={isMoved ? 'header__navbar move' : 'header__navbar'}>
        {postsSection}
        <div className="header__navbar__params">
          <Link
            to="/Params"
            className="header__navbar__params__link clickable"
            onClick={toggleClass}
          ></Link>
          <div className="header__navbar__params__icon">
            <FontAwesomeIcon icon={faSlidersH} />
          </div>
          <span>Paramètres de connexion</span>
        </div>
        <div className="header__navbar__profil">
          <Link
            to="/profil"
            className="header__navbar__profil__link clickable"
            onClick={toggleClass}
          ></Link>
          <div className="header__navbar__profil__icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <span>Profil</span>
        </div>
        <div className="header__navbar__logout">
          <Link
            to="#"
            className="header__navbar__logout__link clickable"
            onClick={logout}
          ></Link>
          <div className="header__navbar__logout__icon">
            <FontAwesomeIcon icon={faPowerOff} />
          </div>
          <span>Déconnexion</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
