# OpenId Connect Authorization Code Flow Sample

The sample is an [Express.js](https://expressjs.com/) app that uses
[Passport.js](http://www.passportjs.org/) and the [Passport-OpenIdConnect](https://github.com/jaredhanson/passport-openidconnect)
module for managing user authentication.

The sample tries to keep everything as simple as possible so only
implements
* Login - redirecting users to Keycloack for authentication
* Logout - destroying the local session and revoking the token at Keycloak
* User Info - fetching profile information from Keycloak
* Echo API request - Authenticated call to echo api (*UPSTREAM_ENDPOINT*)

## Setup
In order to run this sample you need to setup an OpenId Connect
app in your Keycloak Admin portal.

```
$ cat .env
OIDC_BASE=https://KEYCLOAK_DOMAIN/auth/realms/eguzki
OIDC_CLIENT_ID=KEYCLOAK_CLIENT_ID
OIDC_CLIENT_SECRET=KEYCLOAK_CLIENT_SECRET
OIDC_REDIRECT_URI=http://localhost:3000/oauth/callback
UPSTREAM_ENDPOINT=https://api-3scale-apicast-production.eguzki.apps.dev-eng-ocp4-5.dev.3sca.net
```

## Run
This sample uses an express app running on nodejs.

From the command line run
```
> npm install
> npm start
```

### Local testing
By default these samples will run on `http://localhost:3000`.

You will need to add your callback url to the list of approved **Redirect URIs** for your keycloak OIDC app via the Admin portal. e.g. `http://localhost:3000/oauth/callback`
