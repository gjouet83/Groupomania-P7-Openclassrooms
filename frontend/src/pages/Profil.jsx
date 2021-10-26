import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Profil = () => {
  const [isOpenPosts, setOpenPosts] = useState(false);
  const [isOpenComments, setOpenComments] = useState(false);

  const toggleClassPosts = () => {
    setOpenPosts(!isOpenPosts);
  };

  const toggleClassComments = () => {
    setOpenComments(!isOpenComments);
  };

  return (
    <main>
      <section className="profil">
        <h2 className="profil__title">Profil</h2>
        <div className="profil__avatar">
          <FontAwesomeIcon icon={faUser} className="header__menu__area__icon" />
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
        </div>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="profil__userposts__toggledisplay__icon"
          onClick={toggleClassPosts}
        />
        <h2 className="profil__userposts__title">Mes posts</h2>
        <div
          className={
            isOpenPosts ? 'profil__usercomments open' : 'profil__usercomments'
          }
        ></div>
        <div
          className={
            isOpenComments
              ? 'profil__usercomments open'
              : 'profil__usercomments'
          }
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="profil__usercomments__toggledisplay"
            onClick={toggleClassComments}
          />
          <h2 className="profil__usercomments__title">Mes commentaires</h2>
        </div>
      </section>
    </main>
  );
};

export default Profil;
