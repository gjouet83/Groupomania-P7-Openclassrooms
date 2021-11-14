import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <main>
      <h1 className="errorpage">
        Oups.... Cette page n'existe pas ou vous n'êtes pas autorisé a y accéder
      </h1>
      <Link to="/login"> Retour à la page d'accueil</Link>
    </main>
  );
};

export default Error;
