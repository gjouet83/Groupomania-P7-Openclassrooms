export const validEmail = new RegExp(
  /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
);
export const validPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}[^@&"()!_$*€£`+=/;?#]+$/
);

export const validPseudo = new RegExp(/^[a-zA-Z\d\-_\séèàçù]{2,15}$/);

export const validJob = new RegExp(/^[a-zA-Z\d\-_\séèàçù]{3,}$/);
