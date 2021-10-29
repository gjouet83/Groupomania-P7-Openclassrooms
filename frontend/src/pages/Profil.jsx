import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
//import axios from 'axios';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import Comment from '../components/Comment';
const Profil = () => {
  const [isOpenPosts, setOpenPosts] = useState(false);
  const [isOpenComments, setOpenComments] = useState(false);

  const toggleClassPosts = () => {
    setOpenPosts(!isOpenPosts);
  };

  const toggleClassComments = () => {
    setOpenComments(!isOpenComments);
  };

  /*const getAllComments = () => {
    axios
      .get('http://localhost:3000/api/posts/get')
      .then((res) => {
        console.log(res);
      })
      .catch(() => {});
  };*/

  return (
    <main>
      <section className="profil">
        <div className="profil__nav">
          <div className="profil__nav__button">
            <Link
              to="/posts"
              className="profil__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="profil__nav__button__icon"
            />
            <span className="profil__nav__button__describ">Posts</span>
          </div>
          <h2 className="profil__nav__title">Profil</h2>
        </div>
        <div className="profil__avatar">
          <FontAwesomeIcon icon={faUser} className="profil__avatar__icon" />
        </div>
        <div className="profil__buttons">
          <button className="profil__buttons__modify" type="button">
            Modifier
          </button>
          <button className="profil__buttons__delete" type="button">
            Supprimer
          </button>
        </div>
        <div className="profil__username">
          <label className="profil__username__lbl">
            Pseudo:
            <input
              className="profil__username__input"
              name="pseudo"
              type="text"
              placeholder="valeur actuelle"
            />
          </label>
          <button className="profil__username__validate" type="button">
            Modifier
          </button>
        </div>
        <h2 className="profil__userposts__title">Mes posts</h2>
        <button
          className="profil__userposts__toggledisplay"
          type="button"
          onClick={toggleClassPosts}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="profil__userposts__toggledisplay__icon"
          />
          Afficher
        </button>
        <div
          className={
            isOpenPosts
              ? 'profil__userposts__list open'
              : 'profil__userposts__list'
          }
        >
          <Post />
        </div>
        <h2 className="profil__usercomments__title">Mes commentaires</h2>
        <button
          className="profil__usercomments__toggledisplay"
          type="button"
          onClick={toggleClassComments}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="profil__usercomments__toggledisplay__icon"
          />
          Afficher
        </button>
        <div
          className={
            isOpenComments
              ? 'profil__usercomments__list open'
              : 'profil__usercomments__list'
          }
        >
          <Comment />
        </div>
      </section>
    </main>
  );
};

export default Profil;
