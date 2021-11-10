import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { validEmail, validPassword } from '../components/Regexp';

const Params = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser) {
    window.location.assign('/login');
  }
  const [login, setLogin] = useState();
  const [newLogin, setNewLogin] = useState();
  const [checkNewLogin, setCheckNewLogin] = useState();
  const [verifLoginErr, setVerifLoginErr] = useState(false);
  const [verifNewLoginErr, setVerifNewLoginErr] = useState(false);
  const [verifCheckNewLoginErr, setVerifCheckNewLoginErr] = useState(false);
  const [MatchLogins, setMatchLogins] = useState(false);
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [checkNewPassword, setCheckNewPassword] = useState();
  const [verifPwdErr, setVerifPwdErr] = useState(false);
  const [verifNewPwdErr, setVerifNewPwdErr] = useState(false);
  const [verifCheckNewPwdErr, setVerifCheckNewPwdErr] = useState(false);
  const [MatchPwds, setMatchPwds] = useState(false);
  const [backendMessageEmail, setBackendMessageEmail] = useState('');
  const [backendMessagePwd, setBackendMessagePwd] = useState('');

  useEffect(() => {
    if (login && !validEmail.test(login)) {
      setVerifLoginErr(true);
    } else {
      setVerifLoginErr(false);
    }
    if (newLogin && !validEmail.test(newLogin)) {
      setVerifNewLoginErr(true);
    } else {
      setVerifNewLoginErr(false);
    }
    if (checkNewLogin && !validEmail.test(checkNewLogin)) {
      setVerifCheckNewLoginErr(true);
    } else {
      setVerifCheckNewLoginErr(false);
    }
  }, [newLogin, login, checkNewLogin]);

  useEffect(() => {
    if (password && !validPassword.test(password)) {
      setVerifPwdErr(true);
    } else {
      setVerifPwdErr(false);
    }
    if (newPassword && !validPassword.test(newPassword)) {
      setVerifNewPwdErr(true);
    } else {
      setVerifNewPwdErr(false);
    }
    if (checkNewPassword && !validPassword.test(checkNewPassword)) {
      setVerifCheckNewPwdErr(true);
    } else {
      setVerifCheckNewPwdErr(false);
    }
  }, [newPassword, password, checkNewPassword]);

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (newLogin !== checkNewLogin) {
      setMatchLogins(true);
    } else {
      setMatchLogins(false);
    }
    if (!verifLoginErr && !verifNewLoginErr && newLogin === checkNewLogin) {
      sendNewLogin();
    }
  };

  const handleSubmitPwd = (e) => {
    e.preventDefault();
    if (newPassword !== checkNewPassword) {
      setMatchPwds(true);
    } else {
      setMatchPwds(false);
    }
    if (!verifPwdErr && !verifNewPwdErr && newPassword === checkNewPassword) {
      sendNewPassword();
    }
  };

  const sendNewLogin = (e) => {
    const updatedLogin = {
      userId: currentUser.userId,
      email: login,
      newEmail: newLogin,
    };
    axios
      .put('http://localhost:3000/api/users/update/login/:id', updatedLogin, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then(() => {
        window.location.assign('/login');
      })
      .catch((error) => {
        if (error.response.data.error) {
          setBackendMessageEmail('Utilisateur non enregistré');
        } else {
          setBackendMessageEmail('');
        }
      });
  };

  const sendNewPassword = () => {
    const updatedPassword = {
      userId: currentUser.userId,
      password: password,
      newPassword: newPassword,
    };
    axios
      .put(
        'http://localhost:3000/api/users/update/password/:id',
        updatedPassword,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      )
      .then((res) => {
        window.location.assign('/login');
      })
      .catch((error) => {
        if (error.response.data.error) {
          setBackendMessagePwd('Mot de passe incorrect');
        } else {
          setBackendMessagePwd('');
        }
      });
  };

  return (
    <main>
      <section className="params">
        <div className="params__nav">
          <div className="params__nav__button">
            <Link
              to="/posts"
              className="params__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="params__nav__button__icon"
            />
            <span className="params__nav__button__describ">Posts</span>
          </div>
          <h2 className="params__nav__title">Paramètres de connexion</h2>
        </div>
        <form className="params__email">
          <h3 className="params__email__title">email</h3>
          <input
            className="params__email__old__input"
            name="email"
            type="email"
            placeholder="email actuel"
            onChange={(e) => setLogin(e.target.value)}
          />
          {verifLoginErr && <span className="alerte">Email incorrect</span>}
          {backendMessageEmail && (
            <span className="alerte">{backendMessageEmail}</span>
          )}
          <input
            className="params__email__new__input"
            name="email"
            type="email"
            placeholder="nouveau email"
            onChange={(e) => setNewLogin(e.target.value)}
          />
          {verifNewLoginErr && <span className="alerte">Email incorrect</span>}
          <input
            className="params__email__renew__input"
            name="email"
            type="email"
            placeholder="retapez email"
            onChange={(e) => setCheckNewLogin(e.target.value)}
          />
          {verifCheckNewLoginErr && (
            <span className="alerte">Email incorrect</span>
          )}
          {MatchLogins && (
            <span className="alerte">
              le nouvel e-mail ne correspond pas à la vérification
            </span>
          )}
          <button
            className="params__email__validate"
            type="button"
            onClick={handleSubmitLogin}
          >
            Modifier
          </button>
        </form>
        <form className="params__password">
          <h3 className="params__password__title">Password</h3>
          <input
            className="params__password__old__input"
            name="password"
            type="password"
            placeholder="password actuel"
            onChange={(e) => setPassword(e.target.value)}
          />
          {verifPwdErr && (
            <span className="alerte">
              le mot de passe ne respect pas les critères
            </span>
          )}
          {backendMessagePwd && (
            <span className="alerte">{backendMessagePwd}</span>
          )}
          <input
            className="params__password__new__input"
            name="password"
            type="password"
            placeholder="nouveau password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {verifNewPwdErr && (
            <span className="alerte">
              le mot de passe ne respect pas les critères
            </span>
          )}
          <input
            className="params__password__renew__input"
            name="password"
            type="password"
            placeholder="retapez password"
            onChange={(e) => setCheckNewPassword(e.target.value)}
          />
          {verifCheckNewPwdErr && (
            <span className="alerte">
              le mot de passe ne respect pas les critères
            </span>
          )}
          {MatchPwds && (
            <span className="alerte">
              le nouveau mot de passe ne correspond pas à la vérification
            </span>
          )}
          <button
            className="params__password__validate"
            type="button"
            onClick={handleSubmitPwd}
          >
            Modifier
          </button>
        </form>
      </section>
    </main>
  );
};

export default Params;
