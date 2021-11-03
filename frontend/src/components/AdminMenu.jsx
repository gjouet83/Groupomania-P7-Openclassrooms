import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useState } from 'react';
const AdminMenu = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [isMoved, setMove] = useState(false);

  const toggleClass = () => {
    setMove(!isMoved);
  };
  return (
    <div
      className={`header__navbar__admin ${
        currentUser.admin ? '' : 'disappear'
      }`}
    >
      <Link
        to="/Admin"
        className="header__navbar__admin__link clickable"
        onClick={toggleClass}
      ></Link>
      <div className="header__navbar__admin__icon">
        <FontAwesomeIcon icon={faUserShield} />
      </div>
      <span>Administrateur</span>
    </div>
  );
};

export default AdminMenu;
