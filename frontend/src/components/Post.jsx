import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Post = () => {
  return (
    <div className="posts__post">
      <div className="posts__post__header">
        <h2 className="posts__post__header__title">testtitre</h2>
        <div className="posts__post__header__avatar">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <span className="posts__post__header__author">toy74</span>
      </div>
      <p className="posts__post__content">
        je test pour faire le style alors j'ecris n'imp
      </p>
      <div className="posts__post__footer">
        <div className="posts__post__footer__like">
          <Link
            to="#"
            className="posts__post__footer__like__link clickable"
          ></Link>
          <div className="posts__post__footer__like__view">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className="posts__post__footer__like__icon"
            />
            <span className="posts__post__footer__like__nb">12</span>
          </div>
          <span className="posts__post__footer__like__describ">J'aime</span>
        </div>
        <div className="posts__post__footer__dislike">
          <Link
            to="#"
            className="posts__post__footer__dislike__link clickable"
          ></Link>
          <div className="posts__post__footer__dislike__view">
            <FontAwesomeIcon
              icon={faThumbsDown}
              className="posts__post__footer__dislike__view__icon"
            />
            <span className="posts__post__footer__dislike__view__nb">12</span>
          </div>
          <span className="posts__post__footer__dislike__describ">
            Je n'aime pas
          </span>
        </div>
        <div className="posts__post__footer__comments ">
          <Link
            to="/comments"
            className="posts__post__footer__comments__link clickable"
          ></Link>
          <div className="posts__post__footer__comments__view ">
            <FontAwesomeIcon
              icon={faComment}
              className="posts__post__footer__comments__view__icon "
            />
            <span className="posts__post__footer__comments__view__nb">23</span>
          </div>
          <span className="posts__post__footer__comments__describ">
            Commentaires
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
