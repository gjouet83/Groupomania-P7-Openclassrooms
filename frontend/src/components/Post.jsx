import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';

const Post = ({ post }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserdecoded = currentUser && jwt_decode(currentUser);
  const [nbLikes, setNbLikes] = useState();
  const [nbDislikes, setNbDislikes] = useState();
  const [nbComments, setNbComments] = useState();
  const [colorLike, setColorLike] = useState('');
  const [colorDislike, setColorDislike] = useState('');
  const isProfilePage = window.location.pathname;
  const isFigure = post.attachment ? 'appear' : 'disappear';
  const ownerMenu =
    (currentUserdecoded.userId == post.userId ||
      currentUserdecoded.admin == 1) &&
    (isProfilePage == '/profil' || currentUserdecoded.admin == 1)
      ? true
      : false;

  const headers = {
    Authorization: `Bearer ${currentUser}`,
  };
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
  const sendLike = () => {
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id, userId: currentUserdecoded.userId },
      })
      .then((likeByUser) => {
        if (likeByUser.data == null || likeByUser.data.like === 0) {
          const like = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 1,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', like, {
              headers,
            })
            .then((ok) => {
              setColorLike('green');
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (likeByUser.data.like === 1) {
          const unlike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', unlike, {
              headers,
            })
            .then(() => {
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

  const sendDislike = () => {
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: post.id, userId: currentUserdecoded.userId },
      })
      .then((likeByUser) => {
        if (likeByUser.data == null || likeByUser.data.dislike === 0) {
          const dislike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: -1,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', dislike, {
              headers,
            })
            .then((ok) => {
              setColorDislike('red');
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (likeByUser.data.dislike === 1) {
          const undislike = {
            userId: currentUserdecoded.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', undislike, {
              headers,
            })
            .then(() => {
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

  useEffect(() => {
    getNbLikes();
  }, [colorLike, colorDislike]);

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
