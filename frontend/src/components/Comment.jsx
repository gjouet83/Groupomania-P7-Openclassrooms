import axios from 'axios';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import 'moment/locale/fr';

const Comment = ({ comment }) => {
  const isFigure = comment.attachment ? 'appear' : 'disappear'; //on vérifie si le commentaire a une image pour afficher l'élément figure
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); // on décode le token
  //si pas de token stocké alors retour page login
  if (!currentUser) {
    window.location.assign('/login');
  }
  const isProfilePage = window.location.pathname; //on stocke le pathname
  //si le commentaire appartient au user et que l'on se trouve sur la page profil ou si admin:
  //on affiche les commentaires sur la page profil avec le bouton supprimé
  const ownerMenu =
    (currentUserdecoded.userId == comment.userId ||
      currentUserdecoded.admin == 1) &&
    (isProfilePage == '/profil' || currentUserdecoded.admin == 1)
      ? true
      : false;

  //suppression d'un commentaire
  const deleteComment = () => {
    axios
      .delete('http://localhost:3000/api/comments/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: comment.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="comments__comment">
      <div className="comments__comment__author">
        <div className="comments__comment__author__avatar">
          <img
            className="comments__comment__author__avatar__img"
            src={comment.user.avatar}
            alt={`avatar de profil de ${comment.user.username}`}
          />
        </div>
        <div className="comments__comment__author__info">
          <h3>{comment.user.username}</h3>
        </div>
      </div>
      <span className="comments__comment__date">
        Posté le {moment(`${comment.createdAt}`).locale('fr').format('llll')}
      </span>
      <div className="comments__comment__main">
        <figure className={`comments__comment__main__figure ${isFigure}`}>
          <img
            className="comments__comment__main__figure__img"
            src={comment.attachment}
            alt={`média de la publication de ${comment.user.username} en date du ${comment.createdAt}`}
          ></img>
        </figure>
        <p className="comments__comment__main__content">{comment.content}</p>
      </div>
      {ownerMenu ? (
        <div className="comments__comment__ownerMenu">
          <button
            className="comments__comment__ownerMenu__delete"
            type="button"
            onClick={deleteComment}
          >
            supprimer
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Comment;
