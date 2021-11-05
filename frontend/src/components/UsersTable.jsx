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
    axios.put('http://localhost:3000/api/users/update/:id', updatedUser, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
  };

  const deleteUser = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { userId: user.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (user.username == 'toyadmin') {
      setIsAdmin('disappear');
    }
    if (user.admin == 1) {
      setChecked(true);
    }
  }, []);
  return (
    <div className="admin__userarray">
      <span className={`admin__userarray__name ${isAdmin}`}>
        {user.username}
      </span>
      <button
        className={`admin__userarray__userdelete ${isAdmin}`}
        type="button"
        onClick={deleteUser}
      >
        Supprimer
      </button>
      <form
        className={`admin__userarray__element ${isAdmin}`}
        onSubmit={sendForm}
      >
        <label>
          isAdmin ?
          <input
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
