import axios from 'axios';
import ConfirmDelete from './ConfirmDelete';
import { useEffect, useState } from 'react';

const UsersTable = ({ user, forceUpdate, setForceUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const [checked, setChecked] = useState(false);
  const [profilDeletePanel, setProfilDeletePanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');

  const handleChange = () => {
    setChecked(!checked);
  };

  //fonction mise a jour user => admin
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

  //fonction suppression d'un user
  const deleteUser = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: user.id },
      })
      .then(() => {
        setForceUpdate(!forceUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const profilAdvertDelete = () => {
    setProfilDeletePanel(!profilDeletePanel);
  };

  useEffect(() => {
    //après le premier render on n'affiche pas le user "admin", pour empécher sa suppression de la table
    if (user.username === 'Admin') {
      setIsAdmin('disappear');
    }
    //on verifie si le user est admin ou pas et on met a jour le satut
    if (user.admin === 1) {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin__userarray">
      {profilDeletePanel && (
        <>
          <ConfirmDelete
            thisAdvertDelete={profilAdvertDelete}
            thisDelete={deleteUser}
            message="Voulez-vous vraiment supprimer ce compte ? Cette action supprimera aussi tous les commentaires, les posts et les commentaires associés"
          />
        </>
      )}
      <h3 className={`admin__userarray__name ${isAdmin}`}>{user.username}</h3>
      <button
        className={`admin__userarray__userdelete ${isAdmin}`}
        type="button"
        onClick={profilAdvertDelete}
      >
        Supprimer l'utilisateur
      </button>
      <form
        className={`admin__userarray__element ${isAdmin}`}
        onSubmit={sendForm}
      >
        <label className="admin__userarray__element__lbl">
          Administrateur ?
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
