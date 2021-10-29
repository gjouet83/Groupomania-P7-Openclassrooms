import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <main>
      <section className="admin">
        <div className="admin__nav">
          <div className="admin__nav__button">
            <Link
              to="/posts"
              className="admin__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="admin__nav__button__icon"
            />
            <span className="admin__nav__button__describ">Retour</span>
          </div>
          <h2 className="admin__nav__title">Administrateur</h2>
        </div>
        <div className="admin__userarray">
          <table className="admin__userarray__element">
            <tr>
              <th>utilisateur</th>
              <th>Admin</th>
            </tr>
            <tr>
              <td>toy74</td>
              <td>
                <input type="checkbox" id="scales" name="scales"></input>
              </td>
              <td>
                <button type="button">Supprimer</button>
              </td>
            </tr>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Admin;
