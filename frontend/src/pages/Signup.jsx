import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [pseudo, setPseudo] = useState();
  const [signupPseudo, setSignupPseudo] = useState(
    'signup__form__pseudo__input'
  );
  const [signupEmail, setSignupEmail] = useState('signup__form__email__input');
  const [signupPassword, setSignupPassword] = useState(
    'signup__form__email__input'
  );
  const sendForm = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3000/api/users/signup', {
        username: pseudo,
        email: login,
        password: password,
      })
      .then((res) => {
        
        window.location.assign("/login")
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.data === 'username must be unique') {
          setSignupPseudo('signup__form__pseudo__input__wrong');
        } else {
          setSignupPseudo('signup__form__pseudo__input');
        }
        if (error.response.data === 'email must be unique') {
          setSignupEmail('signup__form__email__input__wrong');
        } else {
          setSignupEmail('signup__form__email__input');
        }
        if (
          error.response.data.message ===
          'Le mot de passe doit contenir au moins 8 caractères avec : une majuscule, une minuscule, un chiffre et ne doit pas contenir de caractères spéciaux'
        ) {
          setSignupPassword('signup__form__password__input__wrong');
        } else {
          setSignupPassword('signup__form__password__input');
        }
      });
  };

  return (
    <main>
      <section className="signup">
        <h2 className="signup__title">Créer un compte</h2>
        <form className="signup__form" onSubmit={sendForm}>
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
                8 charactères, 1 majuscule, pas de charactères spéciaux
              </span>
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
