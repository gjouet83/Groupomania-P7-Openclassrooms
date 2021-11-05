import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';

const Params = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [login, setLogin] = useState();
  const [newLogin, setNewLogin] = useState();
  const [checkNewLogin, setCheckNewLogin] = useState();
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [checkNewPassword, setCheckNewPassword] = useState();

  const sendNewLogin = () => {
    if (newLogin === checkNewLogin) {
      const updatedLogin = {
        userId: currentUser.userId,
        email: login,
        newEmail: newLogin,
      };
      axios.put(
        'http://localhost:3000/api/users/update/login/:id',
        updatedLogin,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
    }
  };

  const sendNewPassword = () => {
    if (newPassword === checkNewPassword) {
      const updatedPassword = {
        userId: currentUser.userId,
        password: password,
        newPassword: newPassword,
      };
      axios.put(
        'http://localhost:3000/api/users/update/password/:id',
        updatedPassword,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
    }
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
        <form className="params__email" onSubmit={sendNewLogin}>
          <h3 className="params__email__title">email</h3>
          <input
            className="params__email__old__input"
            name="email"
            type="email"
            placeholder="email actuel"
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            className="params__email__new__input"
            name="email"
            type="email"
            placeholder="nouveau email"
            onChange={(e) => setNewLogin(e.target.value)}
          />
          <input
            className="params__email__renew__input"
            name="email"
            type="email"
            placeholder="retapez email"
            onChange={(e) => setCheckNewLogin(e.target.value)}
          />
          <button className="params__email__validate" type="submit">
            Modifier
          </button>
        </form>
        <form className="params__password" onSubmit={sendNewPassword}>
          <h3 className="params__password__title">Password</h3>
          <input
            className="params__password__old__input"
            name="password"
            type="password"
            placeholder="password actuel"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="params__password__new__input"
            name="password"
            type="password"
            placeholder="nouveau password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="params__password__renew__input"
            name="password"
            type="password"
            placeholder="retapez password"
            onChange={(e) => setCheckNewPassword(e.target.value)}
          />
          <button className="params__password__validate" type="submit">
            Modifier
          </button>
        </form>
      </section>
    </main>
  );
};

export default Params;
