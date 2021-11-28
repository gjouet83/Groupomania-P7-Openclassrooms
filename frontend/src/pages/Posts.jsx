import Post from '../components/Post';
import ConfirmDelete from '../components/ConfirmDelete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';

const Posts = () => {
  const [postsUpdate, setPostsUpdate] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage

  //si pas de token => redirection vers la page login
  if (!currentUser) {
    window.location.assign('/login');
  }

  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on décode le token

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [postCancelPanel, setPostCancelPanel] = useState(false);
  const [image, setImage] = useState(null);
  const [emptyPostPanel, setEmptyPostPanel] = useState(false);
  const contentRef = useRef();
  const imageRef = useRef();

  const getPosts = () => {
    axios
      .get('http://localhost:3000/api/posts/get', {
        headers: { Authorization: `Bearer ${currentUser}` },
      })
      .then((datas) => {
        setPosts(datas.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (contentRef.current.value === '' && imageRef.current.value === '') {
      emptyPostAdvert();
    } else {
      let formData = new FormData();
      formData.append('userId', currentUserdecoded.userId);
      formData.append('content', content);
      formData.append('image', image);
      axios({
        headers: { Authorization: `Bearer ${currentUser}` },
        'Content-Type': 'application/json',
        url: 'http://localhost:3000/api/posts/create',
        method: 'POST',
        data: formData,
      })
        .then(() => {
          // on reset les status et on referme la zone de saisie
          setContent('');
          contentRef.current.value = '';
          setImage(null);
          imageRef.current.value = '';
          toggleClass();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const toggleClass = () => {
    setImage();
    setOpen(!isOpen);
  };

  const cancelImage = () => {
    setImage();
    imageRef.current.value = '';
    setPostsUpdate(!postsUpdate);
  };

  const cancelPost = () => {
    setImage();
    imageRef.current.value = '';
    setContent('');
    contentRef.current.value = '';
    toggleClass();
    postAdvertCancel();
  };

  const emptyPostAdvert = () => {
    setEmptyPostPanel(!emptyPostPanel);
  };

  const postAdvertCancel = () => {
    setPostCancelPanel(!postCancelPanel);
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, postsUpdate]);

  return (
    <main>
      <section className="posts">
        {postCancelPanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={postAdvertCancel}
              thisDelete={cancelPost}
              message={
                'Attention ! Toutes les modifications non validées seront supprimées'
              }
            />
          </>
        )}
        <form onSubmit={sendForm}>
          <div
            className={
              isOpen ? 'posts__createone opencreatepost' : 'posts__createone'
            }
          >
            {emptyPostPanel && (
              <div className="advert">
                <div className="advert__panel">
                  <span className="advert__panel__message">
                    Le post ne peut pas être vide, veuillez d'abord écrire un
                    texte. Si vous souhaitez changer l'image cliquez sur
                    "choisir une image"
                  </span>
                  <div className="advert__panel__buttons">
                    <button
                      className="advert__panel__buttons__cancel"
                      type="button"
                      onClick={emptyPostAdvert}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            )}
            <textarea
              aria-label="zone de saisie de texte"
              className="posts__createone__input"
              placeholder="Redigez votre post ici"
              onChange={(e) => setContent(e.target.value)}
              ref={contentRef}
            ></textarea>
            <div className="posts__createone__addfile">
              <label className="posts__createone__addfile__lbl">
                Choisir une image
                <input
                  className="posts__createone__addfile__input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  ref={imageRef}
                />
              </label>
              <span className="posts__createone__addfile__name">
                {image && image.name}
              </span>
              {image && (
                <button
                  className="posts__createone__addfile__cancel"
                  type="button"
                  onClick={cancelImage}
                >
                  Annuler la Sélection
                </button>
              )}
            </div>
            <div className="posts__createone__footer">
              <button
                className="posts__createone__footer__cancel"
                type="button"
                onClick={postAdvertCancel}
              >
                Annuler
              </button>
              <button
                className="posts__createone__footer__validate"
                type="submit"
              >
                Valider
              </button>
            </div>
          </div>
        </form>
        {/* boucle dans tableau posts pour récupérer chaque post que l'on passe en props */}
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            postsUpdate={postsUpdate}
            setPostsUpdate={setPostsUpdate}
          />
        ))}
        <div className="posts__addbutton">
          <button
            aria-label="créer un post"
            className="posts__addbutton__link clickable"
            onClick={() => setOpen(!isOpen)}
          ></button>
          <FontAwesomeIcon className="posts__addbutton__icon" icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Posts;
