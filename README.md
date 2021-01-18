# Dev
```bash
# jekyll 3.9.0 | Error:  Invalid US-ASCII character "\xE2" on line 5
# -e LANG=C.UTF-8
sudo docker run -i -v "$PWD":/usr/src/app -e LANG=C.UTF-8 -p 4000:4000 -t ruby:2.6 /bin/bash

root@833b0b432b1b:/usr/src/app/notetheme# bundle install
JEKYLL_ENV=production bundle exec jekyll serve
```


# To-do-list

http://0.0.0.0:4000/diy-man-hinh-laptop-cu-raspberry: Footnote
- MathJax local