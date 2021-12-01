import axios from 'axios';
import ConfirmDelete from './ConfirmDelete';
import { useEffect, useState, useRef } from 'react';
import { validPseudo } from '../components/Regexp';

const UsersTable = ({ user, forceUpdate, setForceUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const [profilDeletePanel, setProfilDeletePanel] = useState(false);
  const [avatarDeletePanel, setAvatarDeletePanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');
  const [pseudo, setPseudo] = useState(user.username);
  const [pseudoErr, setPseudoErr] = useState(false);
  const pseudoRef = useRef();
  const [job, setJob] = useState(user.job);
  const [jobErr, setJobErr] = useState(false);
  const jobInputRef = useRef();
  const [backendMessagePseudo, setBackendMessagePseudo] = useState('');

  //fonction suppression d'un user
  const deleteUser = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: user.id },
      })
      .then(() => {
        setForceUpdate(!forceUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAvatar = () => {
    const updatedUser = {
      userId: user.id,
    };
    axios
      .put(
        'http://localhost:3000/api/users/delete/profilimage/:id',
        updatedUser,
        {
          headers: { Authorization: `Bearer ${currentUser}` },
        }
      )
      .then(() => {
        setForceUpdate(!forceUpdate);
        setAvatarDeletePanel(!avatarDeletePanel);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (e) => {
    e.preventDefault();
    setBackendMessagePseudo('');
    if (validPseudo.test(pseudo) || validPseudo.test(job)) {
      const updatedUser = {
        userId: user.id,
        username: pseudo,
        job: job,
      };
      axios
        .put('http://localhost:3000/api/users/update/:id', updatedUser, {
          headers: { Authorization: `Bearer ${currentUser}` },
        })
        .then((ok) => {
          setForceUpdate(!forceUpdate);

          console.log(ok);
        })
        .catch((error) => {
          if (
            error.response.data.errno === 1062 &&
            error.response.data.errField.username
          ) {
            setBackendMessagePseudo('Pseudo déjà utilsé');
          }
          console.log(error);
        });
    }
  };

  const deleteJob = (e) => {
    setJob('Non communiqué');
    jobInputRef.current.value = 'Non communiqué';
    updateUser(e);
  };

  const profilAdvertDelete = () => {
    setProfilDeletePanel(!profilDeletePanel);
  };

  const avatarAdvertDelete = () => {
    setAvatarDeletePanel(!avatarDeletePanel);
  };

  useEffect(() => {
    //après le premier render on n'affiche pas le user "admin", pour empécher sa suppression de la table
    if (user.username === 'Admin') {
      setIsAdmin('disappear');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pseudo && !validPseudo.test(pseudo)) {
      setPseudoErr(true);
    } else {
      setPseudoErr(false);
    }
    if (job && !validPseudo.test(job)) {
      setJobErr(true);
    } else {
      setJobErr(false);
    }
  }, [pseudo, job]);

  return (
    <div className="admin__userarray">
      {profilDeletePanel && (
        <>
          <ConfirmDelete
            thisAdvertDelete={profilAdvertDelete}
            thisDelete={deleteUser}
            message="Voulez-vous vraiment supprimer ce compte ? Cette action supprimera aussi tous les commentaires, les posts et les commentaires associés"
          />
        </>
      )}
      {avatarDeletePanel && (
        <>
          <ConfirmDelete
            thisAdvertDelete={avatarAdvertDelete}
            thisDelete={deleteAvatar}
            message="Voulez-vous vraiment supprimer votre photo de profil ?"
          />
        </>
      )}
      <div className={`admin__userarray__buttons ${isAdmin}`}>
        <button
          className="admin__userarray__buttons__delete"
          type="button"
          onClick={avatarAdvertDelete}
        >
          Supprimer l'avatar
        </button>
      </div>
      <form
        className={`admin__userarray__form ${isAdmin}`}
        onSubmit={updateUser}
      >
        <fieldset className={`admin__userarray__form__fieldset ${isAdmin}`}>
          <label className="admin__userarray__form__fieldset__username__lbl">
            Pseudo:
            <input
              className="admin__userarray__form__fieldset__username__input"
              name="pseudo"
              type="text"
              placeholder={user.username}
              onChange={(e) => setPseudo(e.target.value)}
              ref={pseudoRef}
            />
          </label>
          {pseudoErr && (
            <span className="admin__userarray__form__fieldset__username alerte">
              Invalide
            </span>
          )}
          {backendMessagePseudo && (
            <span className="admin__userarray__form__fieldset__username alerte">
              {backendMessagePseudo}
            </span>
          )}
          <label className="admin__userarray__form__fieldset__job__lbl">
            Poste dans l'entreprise:
            <input
              className="admin__userarray__form__fieldset__job__input"
              name="job"
              type="text"
              placeholder={user.job}
              onChange={(e) => setJob(e.target.value)}
              ref={jobInputRef}
            />
          </label>
          {jobErr && (
            <span className="admin__userarray__form__fieldset__job alerte">
              Invalide
            </span>
          )}
          <button
            className="admin__userarray__form__fieldset__job__delete"
            type="submit"
            onClick={deleteJob}
          >
            Supprimer
          </button>
          <span className="admin__userarray__form__fieldset__job__instruction alerte">
            Cliquez sur enregistrer après toutes modifications
          </span>
        </fieldset>
        <button
          className={`admin__userarray__form__fieldset__job__validate ${isAdmin}`}
          type="submit"
        >
          Enregistrer
        </button>
      </form>
      <h3 className={`admin__userarray__name ${isAdmin}`}>{user.username}</h3>
      <button
        className={`admin__userarray__userdelete ${isAdmin}`}
        type="button"
        onClick={profilAdvertDelete}
      >
        Supprimer l'utilisateur
      </button>
    </div>
  );
};

export default UsersTable;
