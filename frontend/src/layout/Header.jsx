import logo from '../assets/images/icon.svg';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPowerOff,
  faSlidersH,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { ImageContext } from '../utils/context';

const Header = () => {
  const title = 'Groupomania';
  const location = useLocation();
  const { getUserImageProfile, imageProfile } = useContext(ImageContext); // utilisation de useContext pour simplifier le passage de la props
  const [isMoved, setMove] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user')); //on recupère le token du localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on decode le token
  const isAdmin = currentUser && currentUserdecoded.admin ? true : false;
  const isNavbar =
    location.pathname === '/signup' ||
    location.pathname === '/login' ||
    location.pathname === '/'
      ? false
      : true;

  //fonction pour faire apparaitre ou disparaitre le menu
  const toggleClass = () => {
    setMove(!isMoved);
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.assign('/login');
  };

  useEffect(() => {
    if (currentUser) {
      getUserImageProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="header">
      <div className="header__name">
        <img
          width="50"
          height="50"
          src={logo}
          alt="logo du site groupomania"
          className="header__name__logo"
        />
        <h1 className="header__name__title">{title}</h1>
      </div>
      {isNavbar ? (
        <div className="header__menu">
          <figure className="header__menu__area">
            <img
              width="50"
              height="50"
              src={imageProfile}
              className="header__menu__area__icon"
              alt="avatar de l'utilisateur"
              onClick={toggleClass}
            />
          </figure>
        </div>
      ) : null}
      <nav className={isMoved ? 'header__navbar move' : 'header__navbar'}>
        {isAdmin ? (
          <div className="header__navbar__admin">
            <Link
              aria-label="lien vers page admin"
              to="/admin"
              className="header__navbar__admin__link clickable"
              onClick={toggleClass}
            ></Link>
            <div className="header__navbar__admin__icon">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <span>Administrateur</span>
          </div>
        ) : null}
        <div className="header__navbar__params">
          <Link
            aria-label="lien vers page paramètres de connexion"
            to="/params"
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
            aria-label="lien vers page profil utilisateur"
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
          <button
            aria-label="boutton de déconnexion"
            className="header__navbar__logout__link clickable"
            onClick={logout}
          ></button>
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
