import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UsersTable from '../components/UsersTable';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const Admin = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserdecoded = currentUser && jwt_decode(currentUser);
  if (!currentUserdecoded.admin) {
    window.location.assign('/error');
  }
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios
      .get('http://localhost:3000/api/users/get/', {
        headers: { Authorization: `Bearer ${currentUser}` },
      })
      .then((users) => {
        setUsers(users.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main>
      <section className="admin">
        <div className="admin__nav">
          <div className="admin__nav__button">
            <Link
              aria-label="retour vers les posts"
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
        {users.map((user) => (
          <UsersTable key={user.id} user={user} />
        ))}
      </section>
    </main>
  );
};

export default Admin;
