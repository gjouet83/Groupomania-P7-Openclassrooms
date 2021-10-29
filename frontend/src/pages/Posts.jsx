import Post from '../components/Post';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Posts = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleClass = () => {
    setOpen(!isOpen);
  };
  return (
    <main>
      <section className="posts">
        <div
          className={
            isOpen ? 'posts__createone opencreatepost' : 'posts__createone'
          }
        >
          <input
            className="posts__createone__input"
            placeholder="Redigez votre post ici"
          ></input>
          <div className="posts__createone__addfile">
            <button className="posts_createone__footer__cancel" type="button">
              Fichier
            </button>
            <span>lien vers le fichier</span>
          </div>
          <div className="posts__createone__footer">
            <button className="posts_createone__footer__cancel" type="button">
              Annuler
            </button>
            <button className="posts_createone__footer__validate" type="button">
              Valider
            </button>
          </div>
        </div>
        <Post />
        <div className="posts__addbutton">
          <Link
            to="#"
            className="posts__addbutton__link clickable"
            onClick={toggleClass}
          ></Link>
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Posts;
