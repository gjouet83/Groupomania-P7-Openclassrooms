export const validEmail = new RegExp(
  /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
);
export const validPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}[^@&"()!_$*€£`+=\/;?#]+$/
);

export const validPseudo = new RegExp(
  /^[\sa-zA-Z0-9ÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôöùû\.\(\)\[\]\"\'\-,;:\/!\?]+$/
);
