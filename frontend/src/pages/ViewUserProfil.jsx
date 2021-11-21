import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

const ViewUserProfil = () => {
  const [user, setUser] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage

  //on récupère le params pour recupérer le bon user
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('user');

  const getUser = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: id },
      })
      .then((user) => {
        setUser(user.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <section className="viewuserprofil">
        <div className="viewuserprofil__nav">
          <div className="viewuserprofil__nav__button">
            <Link
              aria-label="retour vers les posts"
              to="/posts"
              className="viewuserprofil__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="viewuserprofil__nav__button__icon"
            />
            <span className="viewuserprofil__nav__button__describ">Retour</span>
          </div>
          <h2 className="viewuserprofil__nav__title">
            Profil de {user.username}
          </h2>
        </div>
        <figure className="viewuserprofil__avatar">
          <img
            src={user.avatar}
            className="viewuserprofil__avatar__icon"
            alt={`avatar de profil de ${user.username}`}
          />
        </figure>
        <span className="viewuserprofil__job">
          Poste dans l'entreprise {user.job}
        </span>
        <span className="viewuserprofil__membersince">
          Inscrit sur Groupomania depuis le {''}
          {moment(`${user.createdAt}`).locale('fr').format('LL')}
        </span>
      </section>
    </main>
  );
};

export default ViewUserProfil;
