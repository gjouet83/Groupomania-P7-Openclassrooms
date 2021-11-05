import Comment from '../components/Comment';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = () => {
  const [isOpen, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('postId');

  const headers = {
    Authorization: `Bearer ${currentUser.token}`,
  };

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/comments/get/', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: id },
      })
      .then((comments) => {
        setComments(comments.data.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendForm = () => {
    const comment = {
      userId: currentUser.userId,
      admin: currentUser.admin,
      postId: id,
      content: content,
      attachment: attachment,
    };

    axios
      .post('http://localhost:3000/api/comments/create', comment, { headers })
      .then((res) => {
        window.location.reload();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleClass = () => {
    setOpen(!isOpen);
  };

  return (
    <main>
      <section className="comments">
        <div className="comments__nav">
          <div className="comments__nav__button">
            <Link
              to="/posts"
              className="comments__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="comments__nav__button__icon"
            />
            <span className="comments__nav__button__describ">Retour</span>
          </div>
          <h2 className="comments__nav__title">Commentaires</h2>
        </div>
        <form onSubmit={sendForm}>
          <div
            className={
              isOpen
                ? 'comments__createone opencreatepost'
                : 'comments__createone'
            }
          >
            <textarea
              className="comments__createone__input"
              placeholder="Redigez votre post ici"
              autoCapitalize="on"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="comments__createone__addfile">
              <input
                type="file"
                accept="image/*"
                id="contained-button-file"
                onChange={(e) => setAttachment(e.target.value)}
              />
            </div>
            <div className="comments__createone__footer">
              <button
                className="comments_createone__footer__cancel"
                type="reset"
                onClick={toggleClass}
              >
                Annuler
              </button>
              <button
                className="comments_createone__footer__validate"
                type="submit"
                onClick={toggleClass}
              >
                Valider
              </button>
            </div>
          </div>
        </form>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <div className="comments__addbutton">
          <Link
            to={`/comments?postId=${id}`}
            className="comments__addbutton__link clickable"
            onClick={toggleClass}
          ></Link>
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </section>
    </main>
  );
};

export default Comments;
