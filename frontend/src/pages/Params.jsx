import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const Params = () => {
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
        <div className="params__email">
          <h3 className="params__email__title">email</h3>
          <input
            className="params__email__old__input"
            name="email"
            type="email"
            placeholder="email actuel"
          />
          <input
            className="params__email__new__input"
            name="email"
            type="email"
            placeholder="nouveau email"
          />
          <input
            className="params__email__renew__input"
            name="email"
            type="email"
            placeholder="retapez email"
          />
          <button className="params__email__validate" type="button">
            Modifier
          </button>
        </div>
        <div className="params__password">
          <h3 className="params__password__title">Password</h3>
          <input
            className="params__password__old__input"
            name="password"
            type="password"
            placeholder="password actuel"
          />
          <input
            className="params__password__new__input"
            name="password"
            type="password"
            placeholder="nouveau password"
          />
          <input
            className="params__password__renew__input"
            name="password"
            type="password"
            placeholder="retapez password"
          />
          <button className="params__password__validate" type="button">
            Modifier
          </button>
        </div>
      </section>
    </main>
  );
};

export default Params;
