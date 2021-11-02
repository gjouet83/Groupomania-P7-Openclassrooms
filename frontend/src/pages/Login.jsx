import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [loginEmail, setLoginEmail] = useState('login__form__email__input');
  const [loginPassword, setLoginPassword] = useState(
    'login__form__email__input'
  );
    
  const sendForm = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3000/api/users/login', {
        email: login,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.assign("/posts")
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.data.error === 'Utilisateur non enregistré') {
          setLoginEmail('login__form__email__input__wrong');
        } else {
          setLoginEmail('login__form__email__input');
        }
        if (
          error.response.data.message ===
          'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux'
        ) {
          setLoginPassword('login__form__password__input__wrong');
        } else {
          setLoginPassword('login__form__password__input');
        }
      });
  };

  return (
    <main>
      <section className="login">
        <h2 className="login__title">Connexion</h2>
        <form className="login__form" onSubmit={sendForm}>
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
                8 charactères, 1 majuscule, pas de charactères spéciaux
              </span>
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
