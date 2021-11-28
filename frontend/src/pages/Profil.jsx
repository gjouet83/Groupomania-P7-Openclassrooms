import { useEffect, useState, useContext, useRef } from 'react';
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
import { validPseudo } from '../components/Regexp';
import ConfirmDelete from '../components/ConfirmDelete';
import axios from 'axios';

const Profil = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage
  //si pas de token redirection vers la page login
  if (!currentUser) {
    window.location.assign('/login');
  }
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on decode le token
  const [postsProfilUpdate, setPostsProfilUpdate] = useState(true);
  const [modifyProfilPost, setModifyProfilPost] = useState(false);
  const [commentsProfilUpdate, setCommentsProfilUpdate] = useState(true);
  const { getUserImageProfile, imageProfile } = useContext(ImageContext); //utilisation de useContext pour simplifier le passage de la props
  const [profileUpdate, setProfileUpdate] = useState(true);
  const [isOpenPosts, setOpenPosts] = useState(false);
  const [isOpenComments, setOpenComments] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(0);
  const [pseudo, setPseudo] = useState(user.username);
  const [pseudoErr, setPseudoErr] = useState(false);
  const pseudoRef = useRef();
  const [jobErr, setJobErr] = useState(false);
  const [job, setJob] = useState(user.job);
  const jobInputRef = useRef();
  const [profilImage, setProfilImage] = useState();
  const [profilDeletePanel, setProfilDeletePanel] = useState(false);
  const [avatarDeletePanel, setAvatarDeletePanel] = useState(false);
  const imageRef = useRef();

  const isNotAdminAccount = !currentUserdecoded.admin ? true : false;

  const toggleClassPosts = () => {
    setOpenPosts(!isOpenPosts);
  };

  const toggleClassComments = () => {
    setOpenComments(!isOpenComments);
  };

  const profilAdvertDelete = () => {
    setProfilDeletePanel(!profilDeletePanel);
  };

  const avatarAdvertDelete = () => {
    setAvatarDeletePanel(!avatarDeletePanel);
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

  const deleteJob = () => {
    setJob('Non communiqué');
    jobInputRef.current.value = 'Non communiqué';
    updateUser(setJob('Non communiqué'));
  };

  const updateUser = () => {
    if (validPseudo.test(pseudo) || validPseudo.test(job)) {
      const updatedUser = {
        userId: user.id,
        username: pseudo,
        job: job,
      };
      axios
        .put('http://localhost:3000/api/users/update/:id', updatedUser, {
          headers: { Authorization: `Bearer ${currentUser}` },
        })
        .then((ok) => {
          setProfileUpdate(!profileUpdate);

          console.log(ok);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateProfilImage = () => {
    let formData = new FormData();
    formData.append('userId', user.id);
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
        setProfilImage(!profilImage);
        setProfileUpdate(!profileUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelImage = () => {
    setProfilImage();
    imageRef.current.value = '';
  };

  //suppression de l'image du profil avec un update dans le back avec l'image par defaut
  const deleteAvatar = () => {
    imageRef.current.value = '';
    const updatedUser = {
      userId: user.id,
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
        setAvatarDeletePanel(!avatarDeletePanel);
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
        localStorage.removeItem('user');
        window.location.assign('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (pseudo && !validPseudo.test(pseudo)) {
      setPseudoErr(true);
    } else {
      setPseudoErr(false);
    }
    if (job && !validPseudo.test(job)) {
      setJobErr(true);
    } else {
      setJobErr(false);
    }
  }, [pseudo, job]);

  useEffect(() => {
    getUser();
    getPostByUser();
    getCommentByUser();
    getUserImageProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUpdate, postsProfilUpdate, commentsProfilUpdate, job]);

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
        {profilDeletePanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={profilAdvertDelete}
              thisDelete={deleteAccount}
              message="Voulez-vous vraiment supprimer votre compte ? Cette action supprimera aussi tous vos commentaires, vos posts et les commentaires associés"
            />
          </>
        )}
        {avatarDeletePanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={avatarAdvertDelete}
              thisDelete={deleteAvatar}
              message="Voulez-vous vraiment supprimer votre photo de profil ?"
            />
          </>
        )}
        <figure className="profil__avatar">
          <img
            src={
              !profilImage || profilImage === 0
                ? imageProfile
                : URL.createObjectURL(profilImage)
            }
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
              ref={imageRef}
            />
          </label>
        </div>
        <div className="profil__buttons">
          {profilImage && (
            <button
              className="profil__buttons__modify"
              type="button"
              onClick={updateProfilImage}
            >
              Enregistrer
            </button>
          )}

          {!profilImage || profilImage === 'undefined' ? (
            <button
              className="profil__buttons__delete"
              type="button"
              onClick={avatarAdvertDelete}
            >
              Supprimer
            </button>
          ) : (
            <button
              className="profil__buttons__delete"
              type="button"
              onClick={cancelImage}
            >
              Annuler
            </button>
          )}
        </div>
        <form onSubmit={updateUser}>
          <fieldset className="profil__form">
            <label className="profil__form__username__lbl">
              Pseudo:
              <input
                className="profil__form__username__input"
                name="pseudo"
                type="text"
                placeholder={user.username}
                onChange={(e) => setPseudo(e.target.value)}
                ref={pseudoRef}
              />
            </label>
            {pseudoErr && <span className="alerte">Caractères invalides</span>}
            <label className="profil__form__job__lbl">
              Poste dans l'entreprise:
              <input
                className="profil__form__job__input"
                name="job"
                type="text"
                placeholder={user.job}
                onChange={(e) => setJob(e.target.value)}
                ref={jobInputRef}
              />
            </label>
            {jobErr && <span className="alerte">Caractères invalides</span>}
            <button
              className="profil__form__job__delete"
              type="submit"
              onClick={deleteJob}
            >
              Supprimer
            </button>
          </fieldset>
          <button className="profil__form__job__validate" type="submit">
            Enregistrer
          </button>
        </form>
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
              modifyPost={modifyProfilPost}
              setModifyPost={setModifyProfilPost}
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
        {isNotAdminAccount && (
          <button
            className="profil__deleteaccount"
            type="button"
            onClick={profilAdvertDelete}
          >
            Supprimer mon compte
          </button>
        )}
      </section>
    </main>
  );
};

export default Profil;
