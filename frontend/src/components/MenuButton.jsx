import menu from '../assets/bars-solid.svg';

const MenuButton = () => {
  return (
    <div className="header__menu">
      <img src={menu} alt="icone réglages" className="header__menu__icon" />
    </div>
  );
};

export default MenuButton;
