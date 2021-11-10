import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import { validEmail, validPassword, validPseudo } from '../components/Regexp';

const Signup = () => {
  const [loginErr, setLoginErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [pseudoErr, setPseudoErr] = useState(false);
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [pseudo, setPseudo] = useState();
  const [backendMessagePseudo, setBackendMessagePseudo] = useState('');
  const [backendMessageEmail, setBackendMessageEmail] = useState('');
  const [backendMessagePwd, setBackendMessagePwd] = useState('');
  const [signupPseudo, setSignupPseudo] = useState(
    'signup__form__pseudo__input'
  );
  const [signupEmail, setSignupEmail] = useState('signup__form__email__input');
  const [signupPassword, setSignupPassword] = useState(
    'signup__form__email__input'
  );

  useEffect(() => {
    if (pseudo && !validPseudo.test(pseudo)) {
      setSignupPseudo('signup__form__pseudo__input__wrong');
      setPseudoErr(true);
    } else {
      setSignupPseudo('signup__form__pseudo__input');
      setPseudoErr(false);
    }
    if (login && !validEmail.test(login)) {
      setSignupEmail('signup__form__email__input__wrong');
      setLoginErr(true);
    } else {
      setSignupEmail('signup__form__email__input');
      setLoginErr(false);
    }
    if (password && !validPassword.test(password)) {
      setSignupPassword('signup__form__password__input__wrong');
      setPasswordErr(true);
    } else {
      setSignupPassword('signup__form__password__input');
      setPasswordErr(false);
    }
  }, [pseudo, login, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pseudoErr || !loginErr || !passwordErr) {
      sendForm();
    }
  };

  const sendForm = () => {
    axios
      .post('http://localhost:3000/api/users/signup', {
        username: pseudo,
        email: login,
        password: password,
      })
      .then(() => {
        window.location.assign('/login');
      })
      .catch((error) => {
        if (error.response.data === 'username must be unique') {
          setSignupPseudo('signup__form__pseudo__input__wrong');
          setBackendMessagePseudo('Pseudo déjà utilsé');
        } else {
          setSignupPseudo('signup__form__pseudo__input');
        }
        if (error.response.data === 'email must be unique') {
          setSignupEmail('signup__form__email__input__wrong');
          setBackendMessageEmail('E-mail déjà utilsé');
        } else {
          setSignupEmail('signup__form__email__input');
        }
        if (
          error.response.data.message ===
          'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux'
        ) {
          setSignupPassword('signup__form__password__input__wrong');
          setBackendMessagePwd('Le mot de passe ne respect pas les critères');
        } else {
          setSignupPassword('signup__form__password__input');
        }
      });
  };

  return (
    <>
      <Header />
      <main>
        <section className="signup">
          <h2 className="signup__title">Créer un compte</h2>
          <form className="signup__form" onSubmit={handleSubmit}>
            <div className="signup__form__pseudo">
              <label className="signup__form__pseudo__lbl">
                Pseudo:
                <input
                  className={signupPseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  required
                />
              </label>
              {pseudoErr && (
                <span className="alerte">Caractères invalides</span>
              )}
              {backendMessagePseudo && (
                <span className="alerte">{backendMessagePseudo}</span>
              )}
            </div>
            <div className="signup__form__email">
              <label className="signup__form__email__lbl">
                E-mail:
                <input
                  className={signupEmail}
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
            <div className="signup__form__password">
              <label className="signup__form__password__lbl">
                Mot de passe:
                <input
                  className={signupPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                />
                <span>
                  8 Caractères, 1 majuscule, 1 chiffre, pas de charactères
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
              className="signup__form__validate"
              name="login"
              type="submit"
              value="Valider"
            />
          </form>
          <div className="signup__loginlink">
            <span>
              Si vous possedez déjà un compte <Link to="/login">Connexion</Link>
            </span>
          </div>
        </section>
      </main>
    </>
  );
};

export default Signup;
