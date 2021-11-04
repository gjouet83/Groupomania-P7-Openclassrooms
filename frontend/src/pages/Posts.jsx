import Post from '../components/Post';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const headers = {
    Authorization: `Bearer ${currentUser.token}`,
    'Content-Type': 'application/json; charset=utf-8',
  };
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  console.log(image);

  const getPosts = () => {
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
    formData.append('image', image);
    formData.append('userId', currentUser.userId);
    formData.append('title', title);
    formData.append('content', content);

    axios({
      headers: headers,
      url: 'http://localhost:3000/api/posts/create',
      method: 'POST',
      data: formData,
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
            <input
              type="text"
              className="posts__createone__title"
              placeholder="titre"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <textarea
              className="posts__createone__input"
              placeholder="Redigez votre post ici"
              autoCapitalize="on"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="posts__createone__addfile">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="posts__createone__footer">
              <button
                className="posts_createone__footer__cancel"
                type="reset"
                onClick={toggleClass}
              >
                Annuler
              </button>
              <button
                className="posts_createone__footer__validate"
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
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Posts;
