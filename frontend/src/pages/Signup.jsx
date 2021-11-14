import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  const [signupPseudo, setSignupPseudo] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  //on change le statut en fonction des regexp
  useEffect(() => {
    if (pseudo && !validPseudo.test(pseudo)) {
      setSignupPseudo('wrong');
      setPseudoErr(true);
    } else {
      setSignupPseudo('');
      setPseudoErr(false);
    }
    if (login && !validEmail.test(login)) {
      setSignupEmail('wrong');
      setLoginErr(true);
    } else {
      setSignupEmail('');
      setLoginErr(false);
    }
    if (password && !validPassword.test(password)) {
      setSignupPassword('wrong');
      setPasswordErr(true);
    } else {
      setSignupPassword('');
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
        //si signup ok => redirection page login
        window.location.assign('/login');
      })
      .catch((error) => {
        if (error.response.data === 'username must be unique') {
          setSignupPseudo('wrong');
          setBackendMessagePseudo('Pseudo déjà utilsé');
        } else {
          setSignupPseudo('');
        }
        if (error.response.data === 'email must be unique') {
          setSignupEmail('wrong');
          setBackendMessageEmail('E-mail déjà utilsé');
        } else {
          setSignupEmail('');
        }
        if (
          error.response.data.message ===
          'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux'
        ) {
          setSignupPassword('wrong');
          setBackendMessagePwd('Le mot de passe ne respect pas les critères');
        } else {
          setSignupPassword('');
        }
      });
  };

  return (
    <main>
      <section className="signup">
        <h2 className="signup__title">Créer un compte</h2>
        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form__pseudo">
            <label className="signup__form__pseudo__lbl">
              Pseudo:
              <input
                className={`signup__form__pseudo__input ${signupPseudo}`}
                onChange={(e) => setPseudo(e.target.value)}
                id="pseudo"
                name="pseudo"
                type="text"
                required
              />
            </label>
            {pseudoErr && <span className="alerte">Caractères invalides</span>}
            {backendMessagePseudo && (
              <span className="alerte">{backendMessagePseudo}</span>
            )}
          </div>
          <div className="signup__form__email">
            <label className="signup__form__email__lbl">
              E-mail:*
              <input
                className={`signup__form__email__input ${signupEmail}`}
                onChange={(e) => setLogin(e.target.value)}
                id="login"
                name="email"
                type="email"
                required
              />
              <span className="signup__form__email__info">
                *exemple@provider.com
              </span>
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
              Mot de passe:*
              <input
                className={`signup__form__password__input ${signupPassword}`}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
              />
              <span className="signup__form__password__info">
                *Au moins 8 Caractères, 1 majuscule, 1 chiffre, pas de
                caractères spéciaux
              </span>
              {passwordErr && (
                <span className="alerte">Mot de passe invalide</span>
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
  );
};

export default Signup;
