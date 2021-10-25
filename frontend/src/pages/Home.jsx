import AddButton from '../components/AddButton';
import Posts from '../components/Posts';

const Home = () => {
  return (
    <main>
      <section className="home">
        <Posts />
        <AddButton />
      </section>
    </main>
  );
};

export default Home;
