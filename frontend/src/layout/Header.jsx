import logo from '../assets/images/icon.svg';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = () => {
  const title = 'Groupomania';
  const location = useLocation();
  const [isMoved, setMove] = useState(false);

  const toggleClass = () => {
    setMove(!isMoved);
  };
  const appear =
    location.pathname === '/signup' || location.pathname === '/login'
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
          <Link
            to="#"
            className="header__menu__area__link clickable"
            onClick={toggleClass}
          ></Link>
          <FontAwesomeIcon icon={faUser} className="header__menu__area__icon" />
        </div>
      </div>
      <nav className={isMoved ? 'header__navbar__move' : 'header__navbar'}>
        <div className="header__navbar__params">
          <span>Paramètres de connexion</span>
        </div>
        <div className="header__navbar__profil">
          <span>Profil</span>
        </div>
        <div className="header__navbar__logout">
          <span>Déconnexion</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
