import Post from '../components/Post';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';

const Posts = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (!currentUser) {
    window.location.assign('/login');
  }
  const currentUserdecoded = currentUser && jwt_decode(currentUser);

  const headers = {
    Authorization: `Bearer ${currentUser}`,
  };
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const imageInputRef = useRef();

  const getPosts = () => {
    setContent('');
    imageInputRef.current.value = '';
    setImage(null);
    axios
      .get('http://localhost:3000/api/posts/get', { headers })
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
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/posts/create',
      method: 'POST',
      data: formData,
    })
      .then(() => {
        getPosts();
        toggleClass();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [isOpen, setOpen] = useState(false);

  const toggleClass = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    getPosts();
  }, []);

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
              className="posts__createone__input"
              placeholder="Redigez votre post ici"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="posts__createone__addfile">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageInputRef}
              />
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
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        <div className="posts__addbutton">
          <Link
            to="#"
            className="posts__addbutton__link clickable"
            onClick={toggleClass}
          ></Link>
          <FontAwesomeIcon className="posts__addbutton__icon" icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Posts;
