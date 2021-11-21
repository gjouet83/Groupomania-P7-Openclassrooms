import Comment from '../components/Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faArrowAltCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const Comments = () => {
  const [commentsUpdate, setCommentsUpdate] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState();
  const imageInputRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on décode le token

  //on récupère le params pour commenter le bon post
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('postId');

  // on récupère les commentaires du post avec le params précédemment récupéré
  const getComments = () => {
    axios
      .get('http://localhost:3000/api/comments/get/', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: id },
      })
      .then((comments) => {
        setComments(comments.data.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendForm = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('userId', currentUserdecoded.userId);
    formData.append('postId', id);
    formData.append('content', content);
    formData.append('image', image);
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/comments/create',
      method: 'POST',
      data: formData,
    })
      .then(() => {
        //on reset le statut de content image
        setContent('');
        imageInputRef.current.value = '';
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
    window.scrollTo({ top: 0 });
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, commentsUpdate]);

  return (
    <main>
      <section className="comments">
        <div className="comments__nav">
          <div className="comments__nav__button">
            <Link
              aria-label="retour vers les posts"
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
              aria-label="zone de rédaction du commentaire"
              className="comments__createone__input"
              placeholder="Redigez votre commentaire ici"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="comments__createone__addfile">
              <label className="posts__createone__addfile__lbl">
                Choisir une image
                <input
                  className="posts__createone__addfile__input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  ref={imageInputRef}
                />
              </label>
              <span className="posts__createone__addfile__name">
                {image && image.name}
              </span>
            </div>
            <div className="comments__createone__footer">
              <button
                className="comments__createone__footer__cancel"
                type="reset"
                onClick={toggleClass}
              >
                Annuler
              </button>
              <button
                className="comments__createone__footer__validate"
                type="submit"
              >
                Valider
              </button>
            </div>
          </div>
        </form>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            commentsUpdate={commentsUpdate}
            setCommentsUpdate={setCommentsUpdate}
          />
        ))}
        <div className="comments__addbutton">
          <button
            aria-label="créer un commentaire"
            className="comments__addbutton__link clickable"
            onClick={toggleClass}
          ></button>
          <FontAwesomeIcon
            className="comments__addbutton__icon"
            icon={faEdit}
          />
        </div>
      </section>
    </main>
  );
};

export default Comments;
