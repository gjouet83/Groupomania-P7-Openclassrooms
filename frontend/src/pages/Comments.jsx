import Comment from '../components/Comment';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Comments = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleClass = () => {
    setOpen(!isOpen);
  };
  return (
    <main>
      <section className="comments">
        <div className="comments__nav">
          <div className="comments__nav__button">
            <Link
              to="/posts"
              className="comments__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="comments__nav__button__icon"
            />
            <span className="comments__nav__button__describ">Retour</span>
          </div>
          <h2 className="comments__nav__title">Commentaires</h2>
        </div>
        <div
          className={
            isOpen
              ? 'comments__createone opencreatepost'
              : 'comments__createone'
          }
        >
          <input
            className="comments__createone__input"
            placeholder="Redigez votre post ici"
          ></input>
          <div className="comments__createone__addfile">
            <button
              className="comments_createone__footer__cancel"
              type="button"
            >
              Fichier
            </button>
            <span>lien vers le fichier</span>
          </div>
          <div className="comments__createone__footer">
            <button
              className="comments_createone__footer__cancel"
              type="button"
            >
              Annuler
            </button>
            <button
              className="comments_createone__footer__validate"
              type="button"
            >
              Valider
            </button>
          </div>
        </div>
        <Comment />
        <div className="comments__addbutton">
          <Link
            to="#"
            className="comments__addbutton__link clickable"
            onClick={toggleClass}
          ></Link>
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Comments;
