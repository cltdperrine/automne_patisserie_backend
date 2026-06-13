# Automne Pâtisserie — Backend

API REST développée avec Node.js et Express pour l'application e-commerce **Automne Pâtisserie**.

> Projet réalisé dans le cadre de la formation Développeuse Web et Web Mobile (AFEC).

---

## Technologies

| Outil | Usage |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js 5 | Framework serveur |
| PostgreSQL (Neon) | Base de données serverless |
| JWT | Authentification par token |
| bcrypt | Hachage des mots de passe |
| Joi | Validation des données |
| Multer | Upload de fichiers images |
| cookie-parser | Lecture des cookies HTTP |
| dotenv | Gestion des variables d'environnement |

---

## Fonctionnalités

### Authentification
- Inscription avec validation des données (Joi)
- Connexion avec génération de token JWT en cookie HTTP-only
- Protection des routes privées via middleware

### Produits
- Lister tous les produits (filtrage par catégorie)
- Consulter un produit par son identifiant
- Récupérer les meilleures ventes
- Créer, modifier, supprimer un produit *(admin uniquement)*
- Upload d'image associée au produit

### Catégories
- Lister toutes les catégories
- Consulter une catégorie et ses produits associés
- Créer, modifier, supprimer une catégorie

### Panier
- Ajouter un article au panier
- Consulter le panier de l'utilisateur connecté
- Modifier la quantité d'un article
- Supprimer un article ou vider le panier

### Commandes
- Créer une commande
- Consulter toutes les commandes
- Consulter une commande par son identifiant
- Modifier le statut d'une commande
- Supprimer une commande

### Utilisateurs
- Créer, consulter, modifier et supprimer un utilisateur

### Images
- Upload, consultation et suppression d'images produits

### Contact
- Envoi de formulaire de contact

---

## Architecture

```
src/
├── api/
│   ├── auth/           # Inscription et connexion
│   ├── cart/           # Panier utilisateur
│   ├── categories/     # Catégories de produits
│   ├── contact/        # Formulaire de contact
│   ├── images/         # Upload et gestion des images
│   ├── orders/         # Commandes
│   ├── products/       # Catalogue produits
│   └── users/          # Gestion des utilisateurs
├── middlewares/
│   ├── authMiddleware.js   # Vérification du token JWT
│   ├── role.middleware.js  # Contrôle des droits (admin)
│   └── upload.js           # Configuration Multer
├── services/
│   └── database.js         # Connexion Neon PostgreSQL
├── app.js                  # Configuration Express
└── server.js               # Point d'entrée
scripts/
├── database-schema.js      # Schéma SQL
├── databaseinit.js         # Initialisation de la BDD
├── databasereset.js        # Réinitialisation de la BDD
└── databaseseed.js         # Données de test
```

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/cltdperrine/automne_patisserie.git
cd automne_patisserie_backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
PORT=3001
DATABASE_URL=postgresql://...   # URL de connexion Neon
JWT_SECRET=votre_secret_jwt
CLIENT_URL=http://localhost:5173
```

### 4. Initialiser la base de données

```bash
# Créer les tables
npm run db:init

# Insérer les données de test (optionnel)
npm run db:seed
```

### 5. Lancer le serveur

```bash
npm run dev
```

Le serveur est disponible sur `http://localhost:3001`

---

## Endpoints de l'API

Toutes les routes sont préfixées par `/api`.

### Authentification — `/api/auth`

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/sign-in` | Connexion |

### Produits — `/api/products`

| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/products` | Lister les produits | Public |
| GET | `/api/products/best-sellers` | Meilleures ventes | Public |
| GET | `/api/products/:id` | Détail d'un produit | Public |
| POST | `/api/products` | Créer un produit | Admin |
| PATCH | `/api/products/:id` | Modifier un produit | Admin |
| DELETE | `/api/products/:id` | Supprimer un produit | Admin |

### Catégories — `/api/categories`

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Lister les catégories |
| GET | `/api/categories/:id` | Détail d'une catégorie |
| GET | `/api/categories/:id/products` | Produits d'une catégorie |
| POST | `/api/categories` | Créer une catégorie |
| PATCH | `/api/categories/:id` | Modifier une catégorie |
| DELETE | `/api/categories/:id` | Supprimer une catégorie |

### Panier — `/api/users/cart`

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/users/cart` | Consulter le panier |
| POST | `/api/users/cart` | Ajouter un article |
| PATCH | `/api/users/cart/:product_id` | Modifier la quantité |
| DELETE | `/api/users/cart` | Vider le panier |
| DELETE | `/api/users/cart/:product_id` | Supprimer un article |

### Commandes — `/api/orders`

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/orders` | Lister les commandes |
| GET | `/api/orders/:id` | Détail d'une commande |
| POST | `/api/orders` | Créer une commande |
| PATCH | `/api/orders/:id` | Modifier une commande |
| DELETE | `/api/orders/:id` | Supprimer une commande |

### Utilisateurs — `/api/users`

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/users` | Lister les utilisateurs |
| GET | `/api/users/:id` | Détail d'un utilisateur |
| POST | `/api/users` | Créer un utilisateur |
| PATCH | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

### Contact — `/api/contact`

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/contact` | Envoyer un message de contact |

### Images — `/api/images`

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/images` | Lister les images |
| GET | `/api/images/:id` | Récupérer une image |
| POST | `/api/images` | Uploader une image |
| PATCH | `/api/images/:id` | Modifier une image |
| DELETE | `/api/images/:id` | Supprimer une image |

Les fichiers images uploadés sont accessibles directement via `/uploads/<nom_du_fichier>`.

---

## Sécurité

- Tokens JWT stockés en **cookie HTTP-only** (non accessible en JavaScript)
- Mots de passe hachés avec **bcrypt**
- Middleware de rôle pour les routes réservées aux admins
- Validation des entrées avec **Joi**
- CORS restreint aux origines autorisées

---

## Scripts disponibles

```bash
npm run dev       # Démarre le serveur en mode développement (nodemon)
npm run db:init   # Crée les tables en base de données
npm run db:seed   # Insère des données de test
npm run db:reset  # Réinitialise la base de données
```

---

## Réalisé par

Perrine — Formation Développeuse Web et Web Mobile (AFEC)
