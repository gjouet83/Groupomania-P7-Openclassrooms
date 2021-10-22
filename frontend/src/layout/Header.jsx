import logo from '../assets/images/icon.svg';
import Navbar from '../components/Navbar';
import MenuHeader from '../components/MenuHeader';
import '../sass/style.scss';

const Header = () => {
  const title = 'Groupomania';
  return (
    <header className="header">
      <div className="header__name">
        <img
          src={logo}
          alt="logo du site groupomania"
          className="header__name__logo"
        />
        <h1 className="header__name__title">{title}</h1>
      </div>
      <MenuHeader />
      <Navbar />
    </header>
  );
};

export default Header;
