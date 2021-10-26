import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Comment = () => {
  return (
    <div className="comments__comment">
      <div className="comments__comment__author">
        <div className="comments__comment__author__avatar">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className="comments__comment__author__info">
          <span>inscrit depuis</span>
        </div>
      </div>
      <div className="comments__comment__main">
        <h2 className="comments__comment__main__title">testtitre</h2>
        <p className="comments__comment__main__content">test du commentaire</p>
      </div>
    </div>
  );
};

export default Comment;
