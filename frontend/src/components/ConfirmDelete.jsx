const ConfirmDelete = ({ thisAdvertDelete, thisDelete, message }) => {
  return (
    <div className="advert">
      <div className="advert__panel">
        <span className="advert__panel__message">{message}</span>
        <div className="advert__panel__buttons">
          <button
            className="advert__panel__buttons__cancel"
            type="button"
            onClick={thisAdvertDelete}
          >
            Annuler
          </button>
          <button
            className="advert__panel__buttons__delete"
            type="button"
            onClick={thisDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
