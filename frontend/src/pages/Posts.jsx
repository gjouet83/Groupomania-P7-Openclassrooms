import Post from '../components/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';

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
  const [image, setImage] = useState(null);

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
    let formData = new FormData();
    formData.append('userId', currentUserdecoded.userId);
    formData.append('content', content);
    formData.append('image', image);
    console.log(formData);
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
        setImage(null);
        toggleClass();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleClass = () => {
    setImage();
    setOpen(!isOpen);
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, postsUpdate]);

  return (
    <main>
      <section className="posts">
        <form onSubmit={sendForm}>
          <div
            className={
              isOpen ? 'posts__createone opencreatepost' : 'posts__createone'
            }
          >
            <textarea
              aria-label="zone de saisie de texte"
              className="posts__createone__input"
              placeholder="Redigez votre post ici"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="posts__createone__addfile">
              <label className="posts__createone__addfile__lbl">
                Choisir une image
                <input
                  className="posts__createone__addfile__input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <span className="posts__createone__addfile__name">
                {image && image.name}
              </span>
            </div>
            <div className="posts__createone__footer">
              <button
                className="posts__createone__footer__cancel"
                type="reset"
                onClick={toggleClass}
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
