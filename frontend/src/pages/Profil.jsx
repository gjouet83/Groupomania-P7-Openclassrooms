import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import Comment from '../components/Comment';
import Header from '../layout/Header';
import imageprofildefault from '../assets/images/user-solid.jpg';
import { useContext } from 'react';
import { ImageContext } from '../utils/context';
import axios from 'axios';

const Profil = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const { getUserImageProfile, imageProfile } = useContext(ImageContext);
  const [isOpenPosts, setOpenPosts] = useState(false);
  const [isOpenComments, setOpenComments] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(0);
  const [pseudo, setPseudo] = useState();
  const [profilImage, setProfilImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState([0]);
  const isAdminAccount = currentUser.admin == 0 ? true : false;

  const toggleClassPosts = () => {
    setOpenPosts(!isOpenPosts);
  };

  const toggleClassComments = () => {
    setOpenComments(!isOpenComments);
  };

  const getUser = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { id: currentUser.userId },
      })
      .then((user) => {
        setUser(user.data.user);
      })
      .catch(() => {});
  };

  const updateUser = () => {
    const updatedUser = {
      userId: currentUser.userId,
      username: pseudo,
    };
    axios.put('http://localhost:3000/api/users/update/:id', updatedUser, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
  };

  const updateProfilImage = () => {
    let formData = new FormData();
    formData.append('image', profilImage);
    axios({
      headers: { Authorization: `Bearer ${currentUser.token}` },
      'Content-Type': 'application/json; charset=utf-8',
      url: 'http://localhost:3000/api/users/update/:id',
      method: 'PUT',
      params: { userId: currentUser.userId },
      data: formData,
    });
    window.location.reload();
  };

  const deleteProfilImage = () => {
    let deleteData = new FormData();

    deleteData.append('image', profilImage);
    console.log(profilImage);
    axios({
      headers: { Authorization: `Bearer ${currentUser.token}` },
      'Content-Type': 'application/json; charset=utf-8',
      url: 'http://localhost:3000/api/users/update/:id',
      method: 'PUT',
      params: { userId: currentUser.userId },
      data: deleteData,
    });
    window.location.reload();
  };

  const getCommentByUser = () => {
    axios
      .get('http://localhost:3000/api/comments/get/byUserId', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { userId: currentUser.userId },
      })
      .then((userComments) => {
        setUserComments(userComments.data);
      })
      .catch(() => {});
  };

  const getPostByUser = () => {
    axios
      .get('http://localhost:3000/api/posts/get/byUserId', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { userId: currentUser.userId },
      })
      .then((userPosts) => {
        setUserPosts(userPosts.data);
      })
      .catch(() => {});
  };

  const deleteAccount = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { userId: currentUser.userId },
      })
      .then(() => {
        window.location.assign('/login');
      })
      .catch(() => {});
  };

  useEffect(() => {
    getUser();
    getPostByUser();
    getCommentByUser();
    getUserImageProfile();
  }, []);

  return (
    <>
      <Header user={user} />
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
          <figure className="profil__avatar">
            <img
              src={imageProfile}
              className="profil__avatar__icon"
              alt="photo de profil"
            />
          </figure>
          <div className="profil__input">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilImage(e.target.files[0])}
            />
          </div>
          <div className="profil__buttons">
            <button
              className="profil__buttons__modify"
              type="button"
              onClick={updateProfilImage}
            >
              Modifier
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
            {userPosts.map((post) => (
              <Post key={`post-${post.id}`} post={post} />
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
              <Comment key={`comment-${comment.id}`} comment={comment} />
            ))}
          </div>
          {isAdminAccount ? (
            <button
              className="profil__deleteaccount"
              type="button"
              onClick={deleteAccount}
            >
              Supprimer mon compte
            </button>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default Profil;
