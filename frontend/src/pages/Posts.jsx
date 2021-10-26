import AddButton from '../components/AddButton';
import Post from '../components/Post';

const Posts = () => {
  return (
    <main>
      <section className="posts">
        <Post />
        <AddButton />
      </section>
    </main>
  );
};

export default Posts;
