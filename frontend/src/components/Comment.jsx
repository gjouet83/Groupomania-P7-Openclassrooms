import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

const Comment = ({ comment }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isProfilePage = window.location.pathname;
  const ownerMenu =
    (currentUser.userId == comment.userId || currentUser.admin == 1) &&
    (isProfilePage == '/profil' || currentUser.admin == 1)
      ? true
      : false;

  const deleteComment = () => {
    axios
      .delete('http://localhost:3000/api/comments/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { id: comment.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  return (
    <div className="comments__comment">
      <div className="comments__comment__author">
        <div className="comments__comment__author__avatar">
          <img
            className="comments__comment__author__avatar__img"
            src={comment.user.avatar}
            alt="photo de profil"
          />
        </div>
        <div className="comments__comment__author__info">
          <span>{comment.user.username}</span>
        </div>
      </div>
      <span className="comments__comment__date">
        Posté le {moment(`${comment.createdAt}`).locale('fr').format('llll')}
      </span>
      <div className="comments__comment__main">
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
