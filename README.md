# P7/OPENCLASSROOMS/GROUPOMANIA - CREER UN RESEAU SOCIAL D'ENTREPRISE

## Prérequis:

- Avoir installé GIT et Mysql 5.7 sur sa machine

## INSTRUCTIONS

## POUR LE REPOSITORY

- Cloner le repository avec la commande

```bash
git clone https://github.com/gjouet83/guillaumejouet_7_28092021.git
```

## MySQL

- Ouvrez un deuxième terminal.

- Connectez-vous à mysql.

- Importez le fichier " groupomania.sql "

```bash
mysql -u username -p groupomania < groupomania.sql
```

- username est le nom d'utilisateur avec lequel vous pouvez vous connecter à la base de données

Ceci va créer une base de données nommée "groupomania"

## POUR LE BACKEND

- Ouvrez le fichier " .env-sample " : vous devez assigner des valeurs aux variables suivantes:

```bash
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
USER_TOKEN=
```

- DB_PORT: pour personnaliser le port de la bdd (laisser vide pour le port par defaut)
- DB_USERNAME: votre nom d'utilisiteur pour votre base de données.
- DB_PASSWORD: votre mot de passe pour votre base de données.
- USER_TOKEN = variable de votre choix.

- Renommer ce dossier en " .env "

- Dans un nouveau terminal, a partir du dossier précédemment téléchargé, on accède au dossier Backend

```bash
cd Backend
```

- puis on installe les dépendances

```bash
npm install
```

- enfin, quand l'installation des dépendances est terminée

```bash
npm start
```

- ce message doit apparaitre dans la console

```bash
Connexion à la base de données: SUCCES !
```

## POUR LE FRONTEND

- Dans un nouveau terminal, on accède au dossier frontend

```bash
cd frontend
```

- puis on installe les dépendances

```bash
npm install
```

- enfin, quand l'installation des dépendances est terminée

```bash
npm start
```

## DANS LE NAVIGATEUR

- Ouvrez votre navigateur à l'adresse: http://localhost:3001/
