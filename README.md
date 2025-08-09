# Twitter API pour Vercel

## 🚀 Déploiement en un clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVOTRE_USERNAME%2Ftwitter-api-vercel&env=TWITTER_API_KEY,TWITTER_API_SECRET,TWITTER_ACCESS_TOKEN,TWITTER_ACCESS_SECRET,API_SECRET_TOKEN&envDescription=Twitter%20API%20credentials%20and%20auth%20token&project-name=twitter-api&repository-name=twitter-api)

## Configuration

1. Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
2. Cliquez sur le bouton de déploiement
3. Remplissez vos clés Twitter
4. Générez un token secret aléatoire pour API_SECRET_TOKEN

## Utilisation

Une fois déployé, votre API sera disponible à :
`https://votre-app.vercel.app/api/twitter`

## Variables d'environnement requises

- `TWITTER_API_KEY` - Votre clé API Twitter
- `TWITTER_API_SECRET` - Votre secret API Twitter
- `TWITTER_ACCESS_TOKEN` - Votre token d'accès Twitter
- `TWITTER_ACCESS_SECRET` - Votre secret de token d'accès Twitter
- `API_SECRET_TOKEN` - Token secret pour sécuriser votre API

## Actions disponibles

- `post_tweet` - Publier un tweet
- `search_tweets` - Rechercher des tweets
- `upload_media` - Uploader des médias
- `pin_tweet` - Épingler un tweet
- `delete_tweet` - Supprimer un tweet
- `update_profile_banner` - Mettre à jour la bannière
- `update_profile` - Mettre à jour le profil
