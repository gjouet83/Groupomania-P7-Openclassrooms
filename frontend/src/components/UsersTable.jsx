import axios from 'axios';
import { useEffect, useState } from 'react';

const UsersTable = ({ user }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');

  const handleChange = () => {
    setChecked(!checked);
  };

  const sendForm = () => {
    const updatedUser = {
      userId: user.id,
      admin: checked,
    };
    axios
      .put('http://localhost:3000/api/users/update/:id', updatedUser, {
        headers: { Authorization: `Bearer ${currentUser}` },
      })
      .then((ok) => {
        console.log(ok);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: user.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user.username == 'Admin') {
      setIsAdmin('disappear');
    }
    if (user.admin == 1) {
      setChecked(true);
    }
  }, []);
  return (
    <div className="admin__userarray">
      <h3 className={`admin__userarray__name ${isAdmin}`}>{user.username}</h3>
      <button
        className={`admin__userarray__userdelete ${isAdmin}`}
        type="button"
        onClick={deleteUser}
      >
        Supprimer l'utilisateur
      </button>
      <form
        className={`admin__userarray__element ${isAdmin}`}
        onSubmit={sendForm}
      >
        <label className="admin__userarray__element__lbl">
          isAdmin ?
          <input
            className="admin__userarray__element__input"
            type="checkbox"
            id="admin"
            name="admin"
            checked={checked}
            onChange={handleChange}
          ></input>
        </label>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default UsersTable;
