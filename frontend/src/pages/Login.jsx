import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { validEmail, validPassword } from '../components/Regexp';

const Login = () => {
  const [loginErr, setLoginErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [backendMessageEmail, setBackendMessageEmail] = useState('');
  const [backendMessagePwd, setBackendMessagePwd] = useState('');
  const [loginEmail, setLoginEmail] = useState('login__form__email__input');
  const [loginPassword, setLoginPassword] = useState(
    'login__form__email__input'
  );
  useEffect(() => {
    if (login && !validEmail.test(login)) {
      setLoginEmail('login__form__email__input__wrong');
      setLoginErr(true);
    } else {
      setLoginEmail('login__form__email__input');
      setLoginErr(false);
    }
    if (password && !validPassword.test(password)) {
      setLoginPassword('login__form__password__input__wrong');
      setPasswordErr(true);
    } else {
      setLoginPassword('login__form__password__input');
      setPasswordErr(false);
    }
  }, [login, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginErr || !passwordErr) {
      sendForm();
    }
  };

  const sendForm = () => {
    axios
      .post('http://localhost:3000/api/users/login', {
        email: login,
        password: password,
      })
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        window.location.assign('/posts');
      })
      .catch((error) => {
        if (error.response.data.error === 'Utilisateur non enregistré') {
          setLoginEmail('login__form__email__input__wrong');
          setBackendMessageEmail('Utilisateur non enregistré');
        } else {
          setLoginEmail('login__form__email__input');
        }
        if (error.response.data.error === 'Mot de passe incorrect') {
          setLoginPassword('login__form__password__input__wrong');
          setBackendMessagePwd('Mot de passe incorrect');
        } else {
          setLoginPassword('login__form__password__input');
        }
      });
  };

  return (
    <main>
      <section className="login">
        <h2 className="login__title">Connexion</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form__email">
            <label className="login__form__email__lbl">
              E-mail:
              <input
                className={loginEmail}
                onChange={(e) => setLogin(e.target.value)}
                id="login"
                name="email"
                type="email"
                required
              />
              <span>exemple@provider.com</span>
              {loginErr && (
                <span className="alerte">Adresse E-mail invalide</span>
              )}
              {backendMessageEmail && (
                <span className="alerte">{backendMessageEmail}</span>
              )}
            </label>
          </div>
          <div className="login__form__password">
            <label className="login__form__password__lbl">
              Mot de passe:
              <input
                className={loginPassword}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
              />
              <span>
                8 caractères, 1 majuscule, 1 chiffre, pas de charactères
                spéciaux
              </span>
              {passwordErr && (
                <span className="alerte">Mot de passe invalides</span>
              )}
              {backendMessagePwd && (
                <span className="alerte">{backendMessagePwd}</span>
              )}
            </label>
          </div>
          <input
            className="login__form__validate"
            name="login"
            type="submit"
            value="Valider"
          />
        </form>
        <div className="login__signuplink">
          <span>
            Si vous ne possedez pas de compte{' '}
            <Link to="/signup">Créer un compte</Link>
          </span>
        </div>
      </section>
    </main>
  );
};

export default Login;
