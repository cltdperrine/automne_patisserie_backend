# # Automne Pâtisserie - Backend

API REST développée avec Node.js et Express pour l'application e-commerce Automne Pâtisserie.

Cette API gère l'authentification des utilisateurs, les produits, les catégories, les commandes et le formulaire de contact.

---

## Technologies

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt

---

## Fonctionnalités

### Authentification

- Inscription utilisateur
- Connexion
- Génération de token JWT
- Protection des routes privées

### Utilisateurs

- Consultation du profil
- Modification des informations utilisateur

### Produits

- Récupération des produits
- Consultation d'un produit

### Catégories

- Consultation des catégories

### Panier

- Gestion des articles du panier

### Commandes

- Création d'une commande
- Consultation de l'historique des commandes

### Contact

- Envoi des demandes de contact

---

## Architecture

```bash
src/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
└── database/
```

---

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/cltdperrine/automne_patisserie_backend
```

### Installer les dépendances

```bash
npm install
```

### Configurer les variables d'environnement

Créer un fichier `.env` :

```env
PORT=3000

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
```

### Lancer le serveur

```bash
npm run dev
```

Serveur disponible sur :

```bash
http://localhost:3000
```

---

## Endpoints principaux

### Authentification

```http
POST /auth/register
POST /auth/login
```

### Produits

```http
GET /products
GET /products/:id
```

### Catégories

```http
GET /categories
```

### Utilisateurs

```http
GET /users/:id
PATCH /users/:id
```

### Panier

```http
GET /cart
POST /cart
PATCH /cart
DELETE /cart/:id
```

### Commandes

```http
POST /orders
GET /orders
```

### Contact

```http
POST /contact
```

---

## Sécurité

- Authentification JWT
- Routes protégées
- Hachage des mots de passe avec bcrypt
- Validation des données côté serveur

---

## Base de données

L'application s'appuie sur PostgreSQL pour la gestion :

- des utilisateurs
- des produits
- des catégories
- des commandes
- du panier

---

## Réalisé par

Perrine

Projet réalisé dans le cadre de la formation Développeuse Web et Web Mobile.
