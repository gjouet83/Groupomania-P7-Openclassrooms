import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
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
  const [nbLikes, setNbLikes] = useState(0);
  const [nbDislikes, setNbDislikes] = useState(0);
  const [nbComments, setNbComments] = useState(0);
  const [colorLike, setColorLike] = useState('');
  const [colorDislike, setColorDislike] = useState('');
  const isProfilePage = window.location.pathname;
  const ownerMenu =
    (currentUser.userId == post.userId || currentUser.admin == 1) &&
    (isProfilePage == '/profil' || currentUser.admin == 1)
      ? true
      : false;

  const headers = {
    Authorization: `Bearer ${currentUser.token}`,
  };

  const isFigure = post.attachment ? 'appear' : 'disappear';
  console.log(colorLike);
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/likes/get/', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id },
      })
      .then((likes) => {
        console.log(likes);
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
        setNbLikes(likes.data.map((s) => s.totalLikes));
        setNbDislikes(likes.data.map((s) => s.totaldislikes));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendLike = () => {
    axios
      .get('http://localhost:3000/api/likes/get/user', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id, userId: currentUser.userId },
      })
      .then((likeByUser) => {
        console.log(likeByUser);
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

              console.log(ok);
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
              window.location.reload();
              console.log(ok);
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
              window.location.reload();
              console.log(ok);
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
            .then(() => {
              window.location.reload();
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
      .catch(() => {});
  };

  return (
    <div className="posts__post">
      <div className="posts__post__header">
        <h2 className="posts__post__header__title">{post.title}</h2>
        <span className="posts__post__header__date">
          Posté le {moment(`${post.createdAt}`).locale('fr').format('llll')}
        </span>
        <div className="posts__post__header__avatar">
          <FontAwesomeIcon icon={faUser} />
        </div>
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
            type="submit"
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
