import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ConfirmDelete from './ConfirmDelete';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';

const Post = ({ post, setPostsUpdate, postsUpdate }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on decode le token
  const [nbLikes, setNbLikes] = useState(0);
  const [nbDislikes, setNbDislikes] = useState(0);
  const [nbComments, setNbComments] = useState(0);
  const [colorLike, setColorLike] = useState('');
  const [colorDislike, setColorDislike] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [emptyPostPanel, setEmptyPostPanel] = useState(false);
  const [image, setImage] = useState('');
  const [postCancelPanel, setPostCancelPanel] = useState(false);
  const [postDeletePanel, setPostDeletePanel] = useState(false);
  const [imageDeletePanel, setImageDeletePanel] = useState(false);
  const contentRef = useRef();
  const imageRef = useRef();

  const isProfilePage = window.location.pathname; // on stocke le pathname
  const isFigure = post.attachment ? 'appear' : 'disappear';
  //si le post appartient au user et que l'on se trouve sur la page profil ou si admin:
  //on affiche les posts sur la page profil avec le bouton supprimé
  const ownerMenu =
    (currentUserdecoded.userId === post.userId || currentUserdecoded.admin) &&
    (isProfilePage === '/profil' || currentUserdecoded.admin)
      ? true
      : false;

  //on recupère le nombre de commentaire
  const getNbComment = () => {
    axios
      .get('http://localhost:3000/api/comments/get/', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id },
      })
      .then((comments) => {
        setNbComments(comments.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //on recupère le nombre de likes et dislikes
  const getNbLikes = () => {
    axios
      .get('http://localhost:3000/api/likes/get/', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id },
      })
      .then((likes) => {
        setNbLikes(likes.data.map((nb) => nb.totalLikes));
        setNbDislikes(likes.data.map((nb) => nb.totaldislikes));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //on met a jour le status du like ou dislike en verifiant si le user a un like ou un dislike a 1
  const getLikeStatus = () => {
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id, userId: currentUserdecoded.userId },
      })
      .then((likeStatus) => {
        if (likeStatus.data === null) {
          console.log('pas de like pour le post');
        } else if (likeStatus.data.like === 1) {
          setColorLike('green');
        } else if (likeStatus.data.dislike === 1) {
          setColorDislike('red');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fonction envoie du like ou dislike
  const sendLike = () => {
    // on récupère le like du user pour un post
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id, userId: currentUserdecoded.userId },
      })
      .then((likeByUser) => {
        // si pas de like ou si like = 0 alors c'est un like
        if (likeByUser.data == null || likeByUser.data.like === 0) {
          const like = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 1,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', like, {
              headers: { Authorization: `Bearer ${currentUser}` },
            })
            .then(() => {
              //on passe le status du like en vert
              setColorLike('green');
            })
            .catch((err) => {
              console.log(err);
            });
          // si like= 1 alors c'est un retrait du like
        } else if (likeByUser.data.like === 1) {
          const unlike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', unlike, {
              headers: { Authorization: `Bearer ${currentUser}` },
            })
            .then(() => {
              //on retire le status vert du like
              setColorLike('');
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fonction envoie du dislike
  const sendDislike = () => {
    //on récupère le dislike du user pour un post
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id, userId: currentUserdecoded.userId },
      })
      .then((likeByUser) => {
        //si pas de dislike ou si dislike=0 alors c'est un dislike
        if (likeByUser.data == null || likeByUser.data.dislike === 0) {
          const dislike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: -1,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', dislike, {
              headers: { Authorization: `Bearer ${currentUser}` },
            })
            .then(() => {
              //on passe le status du dislike a rouge
              setColorDislike('red');
            })
            .catch((err) => {
              console.log(err);
            });
          //si dislike = 1 alors c'est un retrait du dislike
        } else if (likeByUser.data.dislike === 1) {
          const undislike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', undislike, {
              headers: { Authorization: `Bearer ${currentUser}` },
            })
            .then(() => {
              //on retire le status rouge du dislike
              setColorDislike('');
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteImagePost = () => {
    imageRef.current.value = '';
    if (post.content === '' && contentRef.current.value === '') {
      emptyPostAdvert();
    } else {
      axios({
        headers: { Authorization: `Bearer ${currentUser}` },
        'Content-Type': 'application/json',
        url: 'http://localhost:3000/api/posts/update/:id',
        method: 'PUT',
        params: { id: post.id },
        data: { attachment: '', content: post.content },
      })
        .then(() => {
          // on reset les status et on referme la zone de saisie
          setPostsUpdate(!postsUpdate);
          imageAdvertDelete();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //fonction mofifier un post
  const sendForm = (e) => {
    e.preventDefault();
    console.log(post.image);
    console.log(post.content);
    if (contentRef.current.value === '' && imageRef.current.value === '') {
      emptyPostAdvert();
    } else {
      let formData = new FormData();
      formData.append('userId', currentUserdecoded.userId);
      formData.append('content', contentRef.current.value);
      formData.append('image', image);
      axios({
        headers: { Authorization: `Bearer ${currentUser}` },
        'Content-Type': 'application/json',
        url: 'http://localhost:3000/api/posts/update/:id',
        method: 'PUT',
        params: { id: post.id },
        data: formData,
      })
        .then(() => {
          // on reset les status et on referme la zone de saisie
          setImage();
          toggleClass();
          setPostsUpdate(!postsUpdate);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //fonction suppression d'un post
  const deletePost = () => {
    const userPost = currentUserdecoded.admin
      ? post.userId
      : currentUserdecoded.userId;
    axios
      .delete('http://localhost:3000/api/posts/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: post.id },
        data: { userId: userPost },
      })
      .then(() => {
        setPostsUpdate(!postsUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const emptyPostAdvert = () => {
    imageDeletePanel && setImageDeletePanel(!imageDeletePanel);
    setEmptyPostPanel(!emptyPostPanel);
  };

  const postAdvertDelete = () => {
    setPostDeletePanel(!postDeletePanel);
  };

  const imageAdvertDelete = () => {
    setImageDeletePanel(!imageDeletePanel);
  };

  const cancelPost = () => {
    setImage();
    imageRef.current.value = '';
    contentRef.current.value = '';
    toggleClass();
    postAdvertCancel();
  };

  const postAdvertCancel = () => {
    setPostCancelPanel(!postCancelPanel);
  };

  // on déclenche la récupération du nombre de like quand le statut colorLike ou colorDislike change
  useEffect(() => {
    getNbLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorLike, colorDislike]);

  //on déclenche la récupération du statut du like et le nombre de commentaire après le premier render
  useEffect(() => {
    getLikeStatus();
    getNbComment();
    contentRef.current.value = post.content;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div className="posts__post">
      <div className="posts__post__header">
        {postDeletePanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={postAdvertDelete}
              thisDelete={deletePost}
              message={'Voulez-vous vraiment supprimer le post ?'}
            />
          </>
        )}
        {postCancelPanel && (
          <>
            <ConfirmDelete
              thisAdvertDelete={postAdvertCancel}
              thisDelete={cancelPost}
              message={'Attention ! Toutes les modifications seront supprimées'}
            />
          </>
        )}
        <span className="posts__post__header__date">
          Posté le {moment(`${post.createdAt}`).locale('fr').format('llll')}
        </span>
        <Link
          aria-label="lien vers le profil de l'auteur du post"
          className="posts__post__header__linkavatar"
          to={`/viewuserprofil?user=${post.userId}`}
        >
          <figure className="posts__post__header__linkavatar__avatar">
            <img
              width="60"
              height="60"
              className="posts__post__header__linkavatar__avatar__img"
              src={post.user.avatar}
              alt={`avatar de profil de ${post.user.username}`}
            />
          </figure>
        </Link>
        <h2 className="posts__post__header__linkauthor__author">
          {post.user.username}
        </h2>
      </div>
      <form onSubmit={sendForm}>
        <div
          className={
            isOpen
              ? 'posts__post__createone opencreatepost'
              : 'posts__post__createone'
          }
        >
          {imageDeletePanel && (
            <>
              <ConfirmDelete
                thisAdvertDelete={imageAdvertDelete}
                thisDelete={deleteImagePost}
                message={"Voulez-vous vraiment supprimer l'image ?"}
              />
            </>
          )}
          {emptyPostPanel && (
            <div className="advert">
              <div className="advert__panel">
                <span className="advert__panel__message">
                  Le post ne peut pas être vide, veuillez d'abord écrire un
                  texte. Si vous souhaitez changer l'image cliquez sur "choisir
                  une image"
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
            className="posts__post__createone__input"
            placeholder="Redigez votre post ici"
            ref={contentRef}
          ></textarea>
          <div className="posts__post__createone__addfile">
            <label className="posts__post__createone__addfile__lbl">
              Choisir une image
              <input
                className="posts__post__createone__addfile__input"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageRef}
              />
            </label>
            <span className="posts__post__createone__addfile__name">
              {image && image.name}
              {!image && post.attachment && post.attachment.split('posts')[1]}
            </span>
            {image && (
              <button
                className="posts__post__createone__addfile__cancel"
                type="button"
                onClick={cancelImage}
              >
                Annuler la Sélection
              </button>
            )}
            {post.attachment && !image && (
              <button
                className="posts__post__createone__addfile__delete"
                type="button"
                onClick={imageAdvertDelete}
              >
                Supprimer l'image
              </button>
            )}
          </div>
          <div className="posts__post__createone__footer">
            <button
              className="posts__post__createone__footer__cancel"
              type="button"
              onClick={postAdvertCancel}
            >
              Annuler
            </button>
            <button
              className="posts__post__createone__footer__validate"
              type="submit"
            >
              Valider
            </button>
          </div>
        </div>
      </form>
      <figure className={`posts__post__figure ${isFigure}`}>
        <img
          width="100%"
          height="100%"
          className="posts__post__figure__img"
          src={post.attachment}
          alt={`média de la publication de ${post.user.username} en date du ${post.createdAt}`}
        ></img>
      </figure>
      <p className="posts__post__content">{post.content}</p>
      <div className="posts__post__footer">
        <div className="posts__post__footer__like">
          <button
            className="posts__post__footer__like__link"
            onClick={sendLike}
          >
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`posts__post__footer__like__icon ${colorLike}`}
            />
            {parseInt(nbLikes) !== 0 && (
              <span className="posts__post__footer__like__nb">{nbLikes}</span>
            )}
            J'aime
          </button>
        </div>
        <div className="posts__post__footer__dislike">
          <button
            className="posts__post__footer__dislike__link"
            onClick={sendDislike}
          >
            <FontAwesomeIcon
              icon={faThumbsDown}
              className={`posts__post__footer__dislike__icon ${colorDislike}`}
            />
            {parseInt(nbDislikes) !== 0 && (
              <span className="posts__post__footer__dislike__nb">
                {nbDislikes}
              </span>
            )}
            Je n'aime pas
          </button>
        </div>
        <div className="posts__post__footer__comments ">
          <Link
            className="posts__post__footer__comments__link"
            to={`/comments?postId=${post.id}`}
          >
            <FontAwesomeIcon
              icon={faComment}
              className="posts__post__footer__comments__icon "
            />
            <span className="posts__post__footer__comments__nb">
              {nbComments}
            </span>
            Commenter
          </Link>
        </div>
      </div>
      {ownerMenu && (
        <div className="posts__post__ownerMenu">
          <button
            className="posts__post__ownerMenu__modify"
            type="button"
            onClick={() => setOpen(!isOpen)}
          >
            modifier
          </button>
          <button
            className="posts__post__ownerMenu__delete"
            type="button"
            onClick={postAdvertDelete}
          >
            supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
