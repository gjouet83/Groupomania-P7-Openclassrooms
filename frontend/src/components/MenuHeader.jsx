import menu from '../assets/images/bars-solid.svg';

const Menuheader = () => {
  return (
    <div className="header__menu">
      <img src={menu} alt="icone réglages" className="header__menu__icon" />
    </div>
  );
};

export default Menuheader;
