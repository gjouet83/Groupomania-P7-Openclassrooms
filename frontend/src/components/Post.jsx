import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';

const Post = ({ post }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on decode le token
  const [nbLikes, setNbLikes] = useState();
  const [nbDislikes, setNbDislikes] = useState();
  const [nbComments, setNbComments] = useState();
  const [colorLike, setColorLike] = useState('');
  const [colorDislike, setColorDislike] = useState('');
  const isProfilePage = window.location.pathname; // on stocke le pathname
  const isFigure = post.attachment ? 'appear' : 'disappear';
  //si le post appartient au user et que l'on se trouve sur la page profil ou si admin:
  //on affiche les posts sur la page profil avec le bouton supprimé
  const ownerMenu =
    (currentUserdecoded.userId == post.userId ||
      currentUserdecoded.admin == 1) &&
    (isProfilePage == '/profil' || currentUserdecoded.admin == 1)
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
        if (likeStatus.data.like === 1) {
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

  //fonction suppression d'un post
  const deletePost = () => {
    axios
      .delete('http://localhost:3000/api/posts/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: post.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // on déclenche la récupération du nombre de like quand le statut colorLike ou colorDislike change
  useEffect(() => {
    getNbLikes();
  }, [colorLike, colorDislike]);

  //on déclenche la récupération du statut du like et le nombre de commentaire après le premier render
  useEffect(() => {
    getLikeStatus();
    getNbComment();
  }, []);

  return (
    <div className="posts__post">
      <div className="posts__post__header">
        <span className="posts__post__header__date">
          Posté le {moment(`${post.createdAt}`).locale('fr').format('llll')}
        </span>
        <figure className="posts__post__header__avatar">
          <img
            className="posts__post__header__avatar__img"
            src={post.user.avatar}
            alt={`avatar de profil de ${post.user.username}`}
          />
        </figure>
        <h2 className="posts__post__header__author">{post.user.username}</h2>
      </div>
      <figure className={`posts__post__figure ${isFigure}`}>
        <img
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
            {nbLikes != 0 && (
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
            {nbDislikes != 0 && (
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
            Commentaires
          </Link>
        </div>
      </div>
      {ownerMenu ? (
        <div className="posts__post__ownerMenu">
          <button
            className="posts__post__ownerMenu__delete"
            type="button"
            onClick={deletePost}
          >
            supprimer
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Post;
