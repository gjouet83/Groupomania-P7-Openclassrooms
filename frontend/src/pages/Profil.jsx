import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faArrowAltCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import Comment from '../components/Comment';
import jwt_decode from 'jwt-decode';
import { ImageContext } from '../utils/context';
import axios from 'axios';

const Profil = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage
  //si pas de token redirection vers la page login
  if (!currentUser) {
    window.location.assign('/login');
  }
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on decode le token
  const [postsProfilUpdate, setPostsProfilUpdate] = useState(true);
  const [commentsProfilUpdate, setCommentsProfilUpdate] = useState(true);
  const { getUserImageProfile, imageProfile } = useContext(ImageContext); //utilisation de useContext pour simplifier le passage de la props
  const [profileUpdate, setProfileUpdate] = useState(true);
  const [isOpenPosts, setOpenPosts] = useState(false);
  const [isOpenComments, setOpenComments] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(0);
  const [pseudo, setPseudo] = useState();
  const [profilImage, setProfilImage] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdminAccount = !currentUserdecoded.admin ? true : false;

  const toggleClassPosts = () => {
    setOpenPosts(!isOpenPosts);
  };

  const toggleClassComments = () => {
    setOpenComments(!isOpenComments);
  };

  const advertDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const getUser = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: currentUserdecoded.userId },
      })
      .then((user) => {
        setUser(user.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = () => {
    const updatedUser = {
      userId: currentUserdecoded.userId,
      username: pseudo,
    };
    axios
      .put('http://localhost:3000/api/users/update/:id', updatedUser, {
        headers: { Authorization: `Bearer ${currentUser}` },
      })
      .then((ok) => {
        console.log(ok);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateProfilImage = () => {
    let formData = new FormData();
    formData.append('userId', currentUserdecoded.userId);
    formData.append('image', profilImage);
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/users/update/:id',
      method: 'PUT',
      data: formData,
    })
      .then(() => {
        getUserImageProfile(profilImage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //suppression de l'image du profil avec un update dans le back avec l'image par defaut
  const deleteProfilImage = () => {
    const updatedUser = {
      userId: currentUserdecoded.userId,
    };
    axios
      .put(
        'http://localhost:3000/api/users/delete/profilimage/:id',
        updatedUser,
        {
          headers: { Authorization: `Bearer ${currentUser}` },
        }
      )
      .then(() => {
        setProfileUpdate(!profileUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCommentByUser = () => {
    axios
      .get('http://localhost:3000/api/comments/get/byUserId', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: currentUserdecoded.userId },
      })
      .then((userComments) => {
        setUserComments(userComments.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPostByUser = () => {
    axios
      .get('http://localhost:3000/api/posts/get/byUserId', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: currentUserdecoded.userId },
      })
      .then((userPosts) => {
        setUserPosts(userPosts.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAccount = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: currentUserdecoded.userId },
      })
      .then(() => {
        window.location.assign('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
    getPostByUser();
    getCommentByUser();
    getUserImageProfile();
  }, [profileUpdate, postsProfilUpdate, commentsProfilUpdate]);

  return (
    <main>
      <section className="profil">
        <div className="profil__nav">
          <div className="profil__nav__button">
            <Link
              aria-label="retour vers les posts"
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
        {confirmDelete && (
          <div className="profil__advert">
            <div className="profil__advert__panel">
              <span className="profil__advert__panel__message">
                Voulez-vous vraiment supprimer votre compte de manière
                définitive ? (Ceci supprimera également vos commentaires, vos
                posts et les commentaires associés)
              </span>
              <div className="profil__advert__panel__buttons">
                <button
                  className="profil__advert__panel__buttons__cancel"
                  type="button"
                  onClick={advertDelete}
                >
                  Annuler
                </button>
                <button
                  className="profil__advert__panel__buttons__delete"
                  type="button"
                  onClick={deleteAccount}
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        )}
        <figure className="profil__avatar">
          <img
            src={!profilImage ? imageProfile : URL.createObjectURL(profilImage)}
            className="profil__avatar__icon"
            alt={`avatar de profil de ${user.username}`}
          />
        </figure>
        <div className="profil__input">
          <label className="profil__input__label">
            Choisir une photo de profil
            <input
              className="profil__input__button"
              aria-label="sélection de l'image pour l'avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilImage(e.target.files[0])}
            />
          </label>
        </div>
        <div className="profil__buttons">
          <button
            className="profil__buttons__modify"
            type="button"
            onClick={updateProfilImage}
          >
            Enregistrer
          </button>
          <button
            className="profil__buttons__delete"
            type="button"
            onClick={deleteProfilImage}
          >
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
              placeholder={user.username}
              onChange={(e) => setPseudo(e.target.value)}
            />
          </label>
          <button
            className="profil__username__validate"
            type="button"
            onClick={updateUser}
          >
            Enregistrer
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
          {userPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              postsUpdate={postsProfilUpdate}
              setPostsUpdate={setPostsProfilUpdate}
            />
          ))}
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
          {userComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              commentsUpdate={commentsProfilUpdate}
              setCommentsUpdate={setCommentsProfilUpdate}
            />
          ))}
        </div>
        {isAdminAccount && (
          <button
            className="profil__deleteaccount"
            type="button"
            onClick={advertDelete}
          >
            Supprimer mon compte
          </button>
        )}
      </section>
    </main>
  );
};

export default Profil;
