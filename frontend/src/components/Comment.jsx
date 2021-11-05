import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Comment = ({ comment }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const ownerMenu =
    currentUser.userId == comment.userId || currentUser.admin == 1
      ? ''
      : 'disappear';
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
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className="comments__comment__author__info">
          <span>{comment.user.username}</span>
        </div>
      </div>
      <div className="comments__comment__main">
        <h2 className="comments__comment__main__title">test</h2>
        <p className="comments__comment__main__content">{comment.content}</p>
      </div>
      <div className={`comments__comment__ownerMenu ${ownerMenu}`}>
        <button
          className="comments__comment__ownerMenu__delete"
          type="button"
          onClick={deleteComment}
        >
          supprimer
        </button>
      </div>
    </div>
  );
};

export default Comment;
