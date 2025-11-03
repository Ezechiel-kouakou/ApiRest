# Test_Tech - Mini API REST

## Bienvenue

Bonjour et bienvenue sur mon projet **Test_Tech** réalisé dans le cadre d’un test technique pour **Tictactrip**.  

[Tictactrip](https://www.tictactrip.eu/) est une **plateforme de mobilité basée en France** qui permet de **trouver et réserver les meilleurs trajets en train et en bus** à travers l’Europe.  
- Elle compare les prix et les horaires pour faciliter les déplacements interurbains.  
- La plateforme met l’accent sur la **simplicité, l’efficacité et la mobilité durable**.  


Je tiens à remercier toute l’équipe de m’avoir donné cette opportunité de créer **une mini-API REST**. Même si cela a pris environ **2 semaines**, j’ai beaucoup appris au cours de ce projet.  

C’est l’essence même de l’apprentissage, que ce soit en alternance, en stage ou en projet personnel : **apprendre encore et encore**. Chaque erreur, chaque test et chaque découverte contribue à progresser.  

---

## Guide pas à pas 

vous pourrez trouver un guide pas à pas a l'adresse suivante : https://docschecklist.infinityfree.me/index.php

## À propos du projet

Le projet consiste en une **API REST minimale** permettant de :  

- Tester la connexion avec un simple `GET /`  
- Générer des tokens pour l’authentification (`POST /api/token`)  
- Justifier du texte (`POST /api/justify`) avec un contrôle du nombre de mots par jour  
- Appliquer une **rate-limit** pour limiter le nombre de requêtes (`50 requêtes toutes les 15 minutes`)  

### Comment j’ai créé le projet (vue générale)

1. **Structure du projet**  
   - Tous les fichiers sources sont en **TypeScript** dans le dossier `src/`  
   - Le build généré est placé dans `dist/` via TypeScript  

2. **Installation et dépendances**  
   - Node.js et npm pour gérer les dépendances  
   - `express` pour créer le serveur et gérer les routes  
   - `helmet` pour sécuriser les en-têtes HTTP  
   - `express-rate-limit` pour limiter le nombre de requêtes  
   - `ts-node` pour exécuter directement le TypeScript sans compilation immédiate  

3. **Fonctionnalités principales**  
   - Création de tokens uniques via `crypto.randomUUID()`  
   - Authentification via `Authorization: Bearer <token>` ou `x-api-key`  
   - Limitation quotidienne du nombre de mots justifiés par token  
   - Gestion des erreurs et messages clairs côté serveur  

4. **Sécurité et bonnes pratiques**  
   - Utilisation de Helmet pour sécuriser les en-têtes  
   - Gestion des erreurs côté serveur pour renvoyer des réponses claires  
   - '.gitignore' pour ne pas pousser les fichiers sensibles ou volumineux ('node_modules/', 'dist/', '.env')  

---

## Remarques personnelles

- Ce projet m’a permis de mettre en pratique **l’ensemble du workflow d’une API REST** : conception, sécurisation, authentification, limitation des requêtes et gestion des erreurs.  
- Chaque étape a été un apprentissage concret, et je suis reconnaissant envers **Tictactrip** pour cette expérience enrichissante.  

---

## Installation rapide

**bash
git clone <URL_DU_REPO>
cd Test_Tech
npm install
# Pour exécuter directement TypeScript
npx ts-node src/index.ts
# Ou compiler puis exécuter le build
npx tsc/npm run build
node dist/index.js

