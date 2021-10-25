import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const Posts = () => {
  const location = useLocation();
  const page = location.pathname === '/home' ? 'home' : 'comments';
  return (
    <div className={`${page}__post`}>
      <div className={`${page}__post__header`}>
        <h2 className={`${page}__post__header__title`}>testtitre</h2>
        <div className={`${page}__post__header__avatar`}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className={`${page}__post__header__author`}>toy74</div>
      </div>
      <div className={`${page}__post__content`}>
        <p>je test pour faire le style alors j'ecris n'imp</p>
      </div>
      <div className={`${page}__post__footer`}>
        <div className={`${page}__post__footer__votes`}>
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`${page}__post__footer__votes__like`}
          />
          <span className={`${page}__post__footer__votes__like__nb`}>12</span>
          <FontAwesomeIcon
            icon={faThumbsDown}
            className={`${page}__post__footer__votes__dislike`}
          />
          <span className={`${page}__post__footer__votes__dislike__nb`}>
            12
          </span>
        </div>
        <div className={`${page}__post__footer__comments`}>
          <FontAwesomeIcon icon={faComment} />
          <span className={`${page}__post__footer__comments__nb`}>23</span>
          <span className={`${page}__post__footer__comments__add`}>
            + ajouter
          </span>
        </div>
      </div>
      <div className={`${page}__post__edit`}>
        <span>modifier</span>
        <span>supprimer</span>
      </div>
    </div>
  );
};

export default Posts;
