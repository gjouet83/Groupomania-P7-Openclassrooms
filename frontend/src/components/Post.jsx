import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';

const Post = ({ post }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [nbLikes, setNbLikes] = useState();
  const [nbDislikes, setNbDislikes] = useState();
  const [nbComments, setNbComments] = useState();
  const [colorLike, setColorLike] = useState('');
  const [colorDislike, setColorDislike] = useState('');
  const isProfilePage = window.location.pathname;
  const isFigure = post.attachment ? 'appear' : 'disappear';
  const ownerMenu =
    (currentUser.userId == post.userId || currentUser.admin == 1) &&
    (isProfilePage == '/profil' || currentUser.admin == 1)
      ? true
      : false;

  const headers = {
    Authorization: `Bearer ${currentUser.token}`,
  };
  const getNbComment = () => {
    axios
      .get('http://localhost:3000/api/comments/get/', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
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
        headers: { Authorization: `Bearer ${currentUser.token}` },
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
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id, userId: currentUser.userId },
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
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id, userId: currentUser.userId },
      })
      .then((likeByUser) => {
        if (likeByUser.data == null || likeByUser.data.like === 0) {
          const like = {
            userId: currentUser.userId,
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
            userId: currentUser.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', unlike, {
              headers,
            })
            .then((ok) => {
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
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id, userId: currentUser.userId },
      })
      .then((likeByUser) => {
        if (likeByUser.data == null || likeByUser.data.dislike === 0) {
          const dislike = {
            userId: currentUser.userId,
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
            userId: currentUser.userId,
            postId: post.id,
            like: 0,
          };
          axios
            .post('http://localhost:3000/api/likes/create/', undislike, {
              headers,
            })
            .then((ok) => {
              setColorDislike('');
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch(() => {});
  };

  const deletePost = () => {
    axios
      .delete('http://localhost:3000/api/posts/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
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
        <h2 className="posts__post__header__title">{post.title}</h2>
        <span className="posts__post__header__date">
          Posté le {moment(`${post.createdAt}`).locale('fr').format('llll')}
        </span>
        <figure className="posts__post__header__avatar">
          <img
            className="posts__post__header__avatar__img"
            src={post.user.avatar}
            alt="photo de profil"
          />
        </figure>
        <span className="posts__post__header__author">
          {post.user.username}
        </span>
      </div>
      <figure className={`posts__post__figure ${isFigure}`}>
        <img
          className="posts__post__figure__img"
          src={post.attachment}
          alt="post"
        ></img>
      </figure>
      <p className="posts__post__content">{post.content}</p>
      <div className="posts__post__footer">
        <div className="posts__post__footer__like">
          <Link
            to="#"
            className="posts__post__footer__like__link clickable"
            type="button"
            onClick={sendLike}
          ></Link>
          <div className="posts__post__footer__like__view">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`posts__post__footer__like__view__icon ${colorLike}`}
            />
            <span className="posts__post__footer__like__view__nb">
              {nbLikes}
            </span>
          </div>
          <span className="posts__post__footer__like__describ">J'aime</span>
        </div>
        <div className="posts__post__footer__dislike">
          <Link
            to="#"
            className="posts__post__footer__dislike__link clickable"
            onClick={sendDislike}
          ></Link>
          <div className="posts__post__footer__dislike__view">
            <FontAwesomeIcon
              icon={faThumbsDown}
              className={`posts__post__footer__dislike__view__icon ${colorDislike}`}
            />
            <span className="posts__post__footer__dislike__view__nb">
              {nbDislikes}
            </span>
          </div>
          <span className="posts__post__footer__dislike__describ">
            Je n'aime pas
          </span>
        </div>
        <div className="posts__post__footer__comments ">
          <Link
            to={`/comments?postId=${post.id}`}
            className="posts__post__footer__comments__link clickable"
          ></Link>
          <div className="posts__post__footer__comments__view ">
            <FontAwesomeIcon
              icon={faComment}
              className="posts__post__footer__comments__view__icon "
            />
            <span className="posts__post__footer__comments__view__nb">
              {nbComments}
            </span>
          </div>
          <span className="posts__post__footer__comments__describ">
            Commentaires
          </span>
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
