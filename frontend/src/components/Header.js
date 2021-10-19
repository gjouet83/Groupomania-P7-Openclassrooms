import logo from "../assets/icon.svg";
import "../style/style.css";

function Header() {
	const title = "Groupomania";
	return (
		<div className="header">
			<img src={logo} alt="logo du site groupomania" className="header__logo" />
			<h1 className="header__title">{title}</h1>
		</div>
	);
}

export default Header;