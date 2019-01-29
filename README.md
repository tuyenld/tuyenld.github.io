# DNS
## CloudFlare

> https://dash.cloudflare.com

Is the record **orange clouded**? An orange clouded record is proxied by Cloudflare. The external facing IP address won’t change in that scenario when you update the record in Cloudflare. Instead, our proxy changes where we direct the traffic.

> Nếu có biểu tượng đám mây màu vàng nghĩa là được proxy bởi CloudFlare nên IP query từ bên ngoài sẽ không đổi.

> https://www.ultratools.com/tools/dnsLookupResult

Setting Custom domain

## Exabytes
> https://billing.exabytes.com/mypanel/clientarea.php


# Hosting
## Firebase

```command
firebase login
firebase init
firebase deploy
```


https://firebasestorage.googleapis.com/v0/b/crushcoding.appspot.com/o/michael-rose.jpg?alt=media&token=06dc656c-4aff-4220-b702-ecc9b80c13e1


https://cloud.google.com/storage/docs/cloud-console
> https://storage.googleapis.com/crushcoding.appspot.com/Skype_Picture.jpeg



```
Firebase Storage tokens do not expire.
They may be revoked from the Firebase Console, which would invalidate URLs based on them.
```

> https://groups.google.com/forum/#!topic/firebase-talk/IjN5bXks6qs

```
The underlying Firebase Auth ID tokens that are used to authenticate to the Realtime Database and Storage expire after one hour, but are automatically refreshed under the hood on your behalf. What exact errors are you seeing and can you share a repro with us?
```

## Comment system

Commento
https://circleci.com/docs/2.0/deployment-integrations/#firebase

> utteranc
https://utteranc.es/
https://www.danyow.net/aurelia-validation-alpha/


https://haacked.com/archive/2018/06/24/comments-for-jekyll-blogs/
https://damieng.com/blog/2018/05/28/wordpress-to-jekyll-comments
https://github.com/octokit/rest.js/
http://mattgreensmith.net/2013/08/08/commit-directly-to-github-via-api-with-octokit/

https://developer.github.com/v3/libraries/


https://www.imagemagick.org/script/command-line-processing.php
https://github.com/firebase/functions-samples/tree/Node-8/image-sharp
https://cloud.google.com/cloud-build/docs/running-builds/automate-builds



https://hackernoon.com/ci-cd-continuous-integration-tools-delivery-react-web-travis-github-example-tutorial-javascript-vue-db8afe9f9a81

aws lambda | Azure Functions | Google Functions: Cost DDoS


git config user.name 'Anonymous'
git config user.email '<>'


# Travis-CI

travis-ci.org is a free service for public open source projects.
travis-ci.com is a paid service for private commercial projects.


https://damien.pobel.fr/post/github-api-from-travisci/

> GitHub Pages Deployment
https://docs.travis-ci.com/user/deployment/pages/


---------------
> https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
For unauthenticated requests, the rate limit allows for up to 60 requests per hour. Unauthenticated requests are associated with the originating IP address, and not the user making requests.

a3266bfa838ddc5f2fdc777be2baf0033bde738d

tregiengchan:
05c2770d09a5c8ece72610d51a08dfa2d93de7fd

https://github.com/google/go-github
https://stackoverflow.com/questions/47876997/github-rest-api-full-example


https://stackoverflow.com/questions/21783079/ajax-in-chrome-sending-options-instead-of-get-post-put-delete
> Request Method: OPTIONS



How it works
The form receiver function for comments relies on a couple of libraries to deal with YML and GitHub but is otherwise self-explanatory. What it does is:

1. Receives the form post over HTTP/HTTPS
2. Attempts to create an instance of the Comment class by mapping form keys to constructor args
3. Emits errors if any constructor args are missing (unless they have a default)
4. Creates a new branch against your default using the GitHub OctoKit.NET library
5. Creates a commit to the new branch with the Comment serialized to YML using YamlDotNet
6. Creates a pull request to merge the branch with an informative title and body