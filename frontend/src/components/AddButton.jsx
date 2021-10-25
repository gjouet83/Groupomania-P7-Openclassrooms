import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const AddButton = () => {
  const location = useLocation();
  const page = location.pathname.replace('/', '').toLowerCase();
  console.log(page);
  return (
    <div className={`${page}__addbutton`}>
      <Link to="../pages/create" className="addbutton__link clickable"></Link>
      <FontAwesomeIcon icon={faEdit} />
    </div>
  );
};

export default AddButton;
