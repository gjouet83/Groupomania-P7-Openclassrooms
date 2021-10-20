import logo from '../assets/icon.svg';
import Navbar from '../components/Navbar';
import MenuButton from '../components/MenuButton';
import '../sass/style.scss';

const Header = () => {
  const title = 'Groupomania';
  return (
    <div className="header">
      <div className="header__name">
        <img
          src={logo}
          alt="logo du site groupomania"
          className="header__name__logo"
        />
        <h1 className="header__name__title">{title}</h1>
      </div>
      <MenuButton />
      <Navbar />
    </div>
  );
};

export default Header;
