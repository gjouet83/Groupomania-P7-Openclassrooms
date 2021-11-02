import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const Post = ({ post }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [likes, setLikes] = useState([]);

  const isFigure = post.attachment ? 'appear' : 'disappear';

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/likes/get/', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { postId: post.id },
      })
      .then((likes) => {
        setLikes(likes.data.map((s) => s.totalLikes));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="posts__post">
      <div className="posts__post__header">
        <h2 className="posts__post__header__title">{post.title}</h2>
        <span className="posts__post__header__date">
          Posté le {moment(`${post.createdAt}`).format('DD/MM/YYYY')}
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
          ></Link>
          <div className="posts__post__footer__like__view">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className="posts__post__footer__like__icon"
            />
            <span className="posts__post__footer__like__nb">{likes}</span>
          </div>
          <span className="posts__post__footer__like__describ">J'aime</span>
        </div>
        <div className="posts__post__footer__dislike">
          <Link
            to="#"
            className="posts__post__footer__dislike__link clickable"
          ></Link>
          <div className="posts__post__footer__dislike__view">
            <FontAwesomeIcon
              icon={faThumbsDown}
              className="posts__post__footer__dislike__view__icon"
            />
            <span className="posts__post__footer__dislike__view__nb">12</span>
          </div>
          <span className="posts__post__footer__dislike__describ">
            Je n'aime pas
          </span>
        </div>
        <div className="posts__post__footer__comments ">
          <Link
            to="/comments"
            className="posts__post__footer__comments__link clickable"
          ></Link>
          <div className="posts__post__footer__comments__view ">
            <FontAwesomeIcon
              icon={faComment}
              className="posts__post__footer__comments__view__icon "
            />
            <span className="posts__post__footer__comments__view__nb">23</span>
          </div>
          <span className="posts__post__footer__comments__describ">
            Commentaires
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
