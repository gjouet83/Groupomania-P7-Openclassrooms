import Comment from '../components/Comment';
import ConfirmDelete from '../components/ConfirmDelete';
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
  const [commentCancelPanel, setCommentCancelPanel] = useState(false);
  const [emptyCommentPanel, setEmptyCommentPanel] = useState(false);
  const contentRef = useRef();
  const imageRef = useRef();
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
    if (contentRef.current.value === '' && imageRef.current.value === '') {
      emptyCommentAdvert();
    } else {
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
    setCommentsUpdate(!commentsUpdate);
  };

  const cancelComment = () => {
    setImage();
    imageRef.current.value = '';
    setContent('');
    contentRef.current.value = '';
    toggleClass();
    commentAdvertCancel();
  };

  const emptyCommentAdvert = () => {
    setEmptyCommentPanel(!emptyCommentPanel);
  };

  const commentAdvertCancel = () => {
    setCommentCancelPanel(!commentCancelPanel);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, commentsUpdate]);

  return (
    <main>
      <section className="comments">
        {commentCancelPanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={commentAdvertCancel}
              thisDelete={cancelComment}
              message={
                'Attention ! Toutes les modifications non validées seront supprimées'
              }
            />
          </>
        )}
        {emptyCommentPanel && (
          <div className="advert">
            <div className="advert__panel">
              <span className="advert__panel__message">
                Le commentaire ne peut pas être vide, veuillez d'abord écrire un
                texte. Si vous souhaitez changer l'image cliquez sur "choisir
                une image"
              </span>
              <div className="advert__panel__buttons">
                <button
                  className="advert__panel__buttons__ok"
                  type="button"
                  onClick={emptyCommentAdvert}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
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
              ref={contentRef}
            ></textarea>
            <div className="comments__createone__addfile">
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
                  className="posts__post__ownerMenu__delete"
                  type="button"
                  onClick={cancelImage}
                >
                  Annuler la Sélection
                </button>
              )}
            </div>
            <div className="comments__createone__footer">
              <button
                className="comments__createone__footer__cancel"
                type="button"
                onClick={commentAdvertCancel}
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
