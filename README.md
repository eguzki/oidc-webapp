# Keycloack OpenId Connect Authorization Code Flow Sample

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

### Configure Red Hat Single Sign-On (keycloak)
To configure RH-SSO, take the following steps:

* Create a realm (<REALM_NAME>).

* Create a client:
  * Specify a client ID.
  * In the Client Protocol field, select openid-connect.
  * To configure the client permissions, set the following values:
    * Access Type to confidential. (not sure required)
    * Standard Flow Enabled to ON.
    * Add your callback url to the list of approved **Valid Redirect URIs** . e.g. `http://myhost.127.0.0.1.nip.io::3000/oauth/callback`
  * Note the client credentials:
    * Make a note of the client ID (<CLIENT_ID>).
    * Navigate to the Credentials tab of the client and make a note of the Secret field (<CLIENT_SECRET>).

* Add a user to the realm:
  * Click the Users menu on the left side of the window.
  * Click Add user.
  * Type the username, set the Email Verified switch to ON, and click Save.
  * On the Credentials tab, set the password. Enter the password in both the fields, set the Temporary switch to OFF to avoid the password reset at the next login, and click Reset Password.
  * When the pop-up window displays, click Change password.


### Set environment
```
$ cat .env
OIDC_BASE=https://KEYCLOAK_DOMAIN/auth/realms/eguzki
OIDC_CLIENT_ID=KEYCLOAK_CLIENT_ID
OIDC_CLIENT_SECRET=KEYCLOAK_CLIENT_SECRET
OIDC_REDIRECT_URI=http://localhost:3000/oauth/callback
UPSTREAM_ENDPOINT=https://api-3scale-apicast-production.eguzki.apps.dev-eng-ocp4-5.dev.3sca.net
```

### Allow Authorino to contact self-signed RHSSO (keycloak)
```
$ echo quit | openssl s_client -showcerts -servername keycloak-eguzki.apps.dev-eng-ocp4-6-operator.dev.3sca.net -connect keycloak-eguzki.apps.dev-eng-ocp4-6-operator.dev.3sca.net:443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > dev-eng-ocp4-6.pem

$ kubectl create configmap ca-pemstore-dev-eng-ocp4-6 --from-file=dev-eng-ocp4-6.pem -n kuadrant-system

$ cat tls-deployment-patch.yaml
spec:
  template:
    spec:
      containers:
      - name: manager
        volumeMounts:
        - name: ca-pemstore-dev-eng-ocp4-6
          mountPath: /etc/ssl/certs/dev-eng-ocp4-6.pem
          subPath: dev-eng-ocp4-6.pem
          readOnly: false
      volumes:
      - name: ca-pemstore-dev-eng-ocp4-6
        configMap:
          name: ca-pemstore-dev-eng-ocp4-6

$ kubectl patch deployment authorino-controller-manager --type=strategic --patch "$(cat tls-deployment-patch.yaml)" -n kuadrant-system
```

## Run
This sample uses an express app running on nodejs.

From the command line run
```
> npm install
> npm start
```

## Local testing
By default these samples will run on `http://myhost.127.0.0.1.nip.io::3000`.
