import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Comment = ({ comment }) => {
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
    </div>
  );
};

export default Comment;
