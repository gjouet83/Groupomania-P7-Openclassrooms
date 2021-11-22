import axios from 'axios';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const Comment = ({ comment, setCommentsUpdate, commentsUpdate }) => {
  const isFigure = comment.attachment ? 'appear' : 'disappear'; //on vérifie si le commentaire a une image pour afficher l'élément figure
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); // on décode le token
  const [isOpen, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const contentRef = useRef();
  //si pas de token stocké alors retour page login
  if (!currentUser) {
    window.location.assign('/login');
  }
  const isProfilePage = window.location.pathname; //on stocke le pathname
  //si le commentaire appartient au user et que l'on se trouve sur la page profil ou si admin:
  //on affiche les commentaires sur la page profil avec le bouton supprimé
  const ownerMenu =
    (currentUserdecoded.userId === comment.userId ||
      currentUserdecoded.admin) &&
    (isProfilePage === '/profil' || currentUserdecoded.admin)
      ? true
      : false;

  const deleteImageComment = () => {
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/comments/update/:id',
      method: 'PUT',
      params: { id: comment.id },
      data: { attachment: '' },
    })
      .then(() => {
        // on reset les status et on referme la zone de saisie
        setCommentsUpdate(!commentsUpdate);
        toggleClass();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fonction mofifier un post
  const sendForm = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('userId', currentUserdecoded.userId);
    formData.append('content', contentRef.current.value);
    formData.append('image', image);
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/comments/update/:id',
      method: 'PUT',
      params: { id: comment.id },
      data: formData,
    })
      .then(() => {
        // on reset les status et on referme la zone de saisie
        setImage(null);
        toggleClass();
        setCommentsUpdate(!commentsUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleClass = () => {
    setImage();
    setOpen(!isOpen);
  };

  //suppression d'un commentaire
  const deleteComment = () => {
    const userComment = currentUserdecoded.admin
      ? comment.userId
      : currentUserdecoded.userId;
    axios
      .delete('http://localhost:3000/api/comments/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: comment.id },
        data: { userId: userComment },
      })
      .then(() => {
        setCommentsUpdate(!commentsUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    contentRef.current.value = comment.content;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div className="comments__comment">
      <div className="comments__comment__author">
        <div className="comments__comment__author__avatar">
          <Link to={`/viewuserprofil?user=${comment.userId}`}>
            <img
              className="comments__comment__author__avatar__img"
              src={comment.user.avatar}
              alt={`avatar de profil de ${comment.user.username}`}
            />
          </Link>
        </div>
        <div className="comments__comment__author__info">
          <Link
            className="comments__comment__author__info__link"
            to={`/viewuserprofil?user=${comment.userId}`}
          >
            <h3>{comment.user.username}</h3>
          </Link>
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
      <form onSubmit={sendForm}>
        <div
          className={
            isOpen
              ? 'comments__comment__createone opencreatepost'
              : 'comments__comment__createone'
          }
        >
          <textarea
            aria-label="zone de saisie de texte"
            className="comments__comment__createone__input"
            placeholder="Redigez votre post ici"
            ref={contentRef}
          ></textarea>
          <div className="comments__comment__createone__addfile">
            <label className="comments__comment__createone__addfile__lbl">
              Choisir une image
              <input
                className="comments__comment__createone__addfile__input"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <button
              className="comments__comment__ownerMenu__delete"
              type="reset"
              onClick={deleteImageComment}
            >
              supprimer
            </button>
            <span className="comments__comment__createone__addfile__name">
              {image && image.name}
              {!image && comment.attachment.split('posts')[1]}
            </span>
          </div>
          <div className="comments__comment__createone__footer">
            <button
              className="comments__comment__createone__footer__cancel"
              type="reset"
              onClick={toggleClass}
            >
              Annuler
            </button>
            <button
              className="comments__comment__createone__footer__validate"
              type="submit"
            >
              Valider
            </button>
          </div>
        </div>
      </form>
      {ownerMenu ? (
        <div className="comments__comment__ownerMenu">
          <button
            className="comments__comment__ownerMenu__modify"
            type="button"
            onClick={() => setOpen(!isOpen)}
          >
            modifier
          </button>
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
