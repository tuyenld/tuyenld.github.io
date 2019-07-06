---
title: How to use Google Analytics API
excerpt: "Using Google Analytics API on ruby and python."
categories:
  - blog
tags: 
  - blog
  - jekyll
---

I want to show *pageview* on my blog. One problem is this blog is static blog (powered by Jekyll), so I think about use Google Analytics to do that. I found a ton of document, there are many keyword on Google Cloud Product.
* Services Account
* Access Token
* Fresh Token
* OAuth 2.0


Do I need spend all my free time to understand these?

I don't know where can I start, I just want to it as simple as possible.
Using google API is not easy task for me in the first time, even it is several line of code. I tried to find a sample example on github page, but I failed. I can't find any instruction one by one to do that. Therefore, I want to share with you how can I do that. Let's see.

## 1. Setting on your account
In this step you need to find:
1. Your Profile ID: `profileID`
2. `Service account` private key (`KEY_FILEPATH` \*json file)

### 1.1 Add a *Services Account*
#### 1. Goto [Google console](https://console.developers.google.com/iam-admin/serviceaccounts?supportedpurview=project)
#### 2. Click *Create service account* on the top, near navigation bar.
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/add-service-acc.jpg" alt="">
</figure>
#### 3. Click *CREATE KEY*, choose *json*

You are able to download this private json file only one time.
{:.info}

<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/json-key-service-acc.jpg" alt="">
</figure>

After finish, you will see something like this.
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/add-service-finish.jpg" alt="">
</figure>

### 1.2 Add the *Services Account* to your *Google analytics service*

#### 1. Goto [Google analytics](https://analytics.google.com/analytics/web/)
it will redirect you to link like this:
```
https://analytics.google.com/analytics/web/#/a133437467w193286472p188904382/admin/account/settings
```

```
/a[6 digits]w[8 digits]p[8 digits]
```
The 8 digits which after the "p" are your profile ID. (in my case this is 188904382)

#### 2. Click *User Management*
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/add-service-acc-to-google-api-service.jpg" alt="">
</figure>

#### 3. Click *+* on the top to add *Service Account* > Click *Add users*
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/click-plus-symbol-to-add-new-acc.jpg" alt="">
</figure>
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/add-your-email.jpg" alt="">
</figure>

After finish, you will see something as following.
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-07-06-how-to-use-google-analytics-api/add-service-acc-to-analytics-finish.jpg" alt="">
</figure>

## 2. Using ruby

{% highlight ruby linenos %}

require 'googleauth'
require 'google/apis/analytics_v3'

# Thank to https://qiita.com/mochizukikotaro/items/4a7aef0fe50066a2ed80

profileID = 'ga:188904382'   # Profile ID 
startDate = '300daysAgo'
endDate = 'yesterday'
metrics = 'ga:pageviews'     # Metrics code
dimensions = 'ga:pagePath'   # Dimensions
# The scope for the OAuth2 request.
SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
URL = 'https://www.googleapis.com/analytics/v3/data/ga'

# The location of the key file with the key json data.
KEY_FILEPATH = 'crushcoding-163b3f074083.json'


authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
  json_key_io: File.open(KEY_FILEPATH),
  scope: SCOPE)

credentials = authorizer.fetch_access_token!
puts credentials['access_token']

stats = Google::Apis::AnalyticsV3::AnalyticsService.new
stats.authorization = authorizer
post_stats = stats.get_ga_data(profileID, startDate, endDate, metrics, dimensions: dimensions)

post_stats.rows.each do |row|
  puts row
end

{% endhighlight %}

Sample output as following.
```
20
/life/nguoi-la-mai-thao-yen.html
1
/life/nguoi-la-mai-thao-yen/
13
/openwrt/2019/02/11/upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb.html
1
/openwrt/upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb
```

## 3. Using python

{% highlight python linenos %}

# service-account.py

import httplib2
import pprint
import sys
import requests

from oauth2client.service_account import ServiceAccountCredentials

profileID = 'ga:188904382'   # Profile ID 
startDate = '300daysAgo'
endDate = 'yesterday'
metrics = 'ga:pageviews'     # Metrics code
dimensions = 'ga:pagePath'   # Dimensions
# The scope for the OAuth2 request.
SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
URL = 'https://www.googleapis.com/analytics/v3/data/ga'

# The location of the key file with the key json data.
KEY_FILEPATH = 'crushcoding-163b3f074083.json'

# Defines a method to get an access token from the ServiceAccount object.
def get_access_token():
  return ServiceAccountCredentials.from_json_keyfile_name(
      KEY_FILEPATH, SCOPE).get_access_token().access_token

credentials = get_access_token()
print (credentials)

# Sample: https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A188904382
# &start-date=30daysAgo&end-date=yesterday&metrics=ga%3Apageviews
# &dimensions=ga%3ApagePath&access_token=ya29.Gxxx
url = URL + '?ids=' + profileID + '&start-date=' + startDate + \
			'&end-date=' + endDate + '&metrics=' + metrics + \
			'&dimensions=' + dimensions + '&access_token={0}'.format(credentials)

print (url)

r = requests.get(url)
ga_data = r.json()
pprint.pprint(ga_data)

{% endhighlight %}

Sample output as following.
```
          ['/about.html', '2'],
          ['/archive.html', '5'],
          ['/archive.html?tag=An+Nam', '1'],
          ['/archive.html?tag=Nguyễn+Ái+Quốc', '2'],
          ['/archive.html?tag=Văn+học', '7'],
          ['/archive.html?tag=life', '1'],
          ['/categories/', '18'],
          ['/header-image', '4'],
          ['/kkk', '3'],

```

## 4. Some error you may encounted

```
Error: Authorization failed. Server message: { "error": "invalid_grant", "error_description": "Invalid JWT: Token must be a short-lived token (60 minutes) and in a reasonable timeframe. Check your iat and exp values and use a clock with skew to account for clock differences between systems." }
             Error: Run jekyll build --trace for more information.
```
> I ues on Ubuntu on my Virtual box and Ubuntu time is not synced. Solution is update time on Ubuntu: ``sudo ntpdate time.nist.gov```

## 5. References
- [Google Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/?csw=1)
- [Martin Fowler blog](https://martinfowler.com/articles/command-line-google.html)
- [Jekyll-Ga-V2 A Plugin To Get Google Analytics Data Into Your Site - Jekyll static site](https://z3nth10n.net/en/2019/03/22/jekyll-ga-v2-plugin-to-get-google-analytics-data-into-your-site)