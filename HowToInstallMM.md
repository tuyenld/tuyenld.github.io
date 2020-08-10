Reference:
[https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-14-04)

sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev
sudo apt-get install git
cd /
mkdir tool
cd tool
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/tool/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
git clone git://github.com/sstephenson/ruby-build.git ~/tool/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/tool/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile 
rbenv install -v 2.3.0
rbenv global 2.3.0




--------------------------

https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-18-04


sudo apt update

sudo apt install -y autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev

sudo apt-get libssl1.0-dev


git clone https://github.com/rbenv/rbenv.git ~/.rbenv

echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

type rbenv
```
rbenv is a function
rbenv ()
{
    local command;
    command="${1:-}";
    if [ "$#" -gt 0 ]; then
        shift;
    fi;
    case "$command" in
        rehash | shell)
            eval "$(rbenv "sh-$command" "$@")"
        ;;
        *)
            command rbenv "$command" "$@"
        ;;
    esac
}
```

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install -l
rbenv install -v 2.3.0
rbenv global 2.3.0
## Fix error in Ubuntu server 18.04

```
Bundler could not find compatible versions for gem "bundler":
  In Gemfile:
    bundler (~> 1.15)
```


```
gem install bundler -v '1.15'
gem list bundler
bundle _1.15_ install
bundle _1.15_ exec jekyll build

# Production
JEKYLL_ENV=production bundle _1.15_ exec jekyll serve 

# Debug, verbose
JEKYLL_ENV=production bundle _1.15_ exec jekyll serve  -V

```

------------------------------------

gem install bundler
gem install jekyll
ruby -v
gem -v
jekyll -v

vi Gemfile
```
source "https://rubygems.org"
gemspec
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jemoji"
  gem "jekyll-redirect-from"    
end
```

bundle

```bash
vi _config.yml

# Add at the end of file
# deployment
host: 0.0.0.0
port: 5000
```
## Docker
```bash
sudo apt-get install git
sudo apt-get install curl

ls -la
# -rw-r--r--  1 ldtuyen ldtuyen 22610446 Thg 1   4 13:55 containerd.io_1.2.6-3_amd64.deb
# -rw-r--r--  1 ldtuyen ldtuyen 22820222 Thg 1   4 13:55 docker-ce_19.03.5~3-0~debian-buster_amd64.deb
# -rw-r--r--  1 ldtuyen ldtuyen 42523182 Thg 1   4 13:55 docker-ce-cli_19.03.5~3-0~debian-buster_amd64.deb
sudo dpkg -i *.deb
sudo docker run hello-world

sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

mkdir working
cd working/
git clone https://github.com/kitian616/jekyll-TeXt-theme.git
cd jekyll-TeXt-theme/

sudo docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app ruby:2.6 bundle install
sudo docker-compose -f ./docker/docker-compose.build-image.yml build

# Run doker to compile post
sudo docker-compose -f ./docker/docker-compose.default.yml up

sudo docker ps
sudo docker images

# Just for test
sudo docker run -i -v "$PWD":/usr/src/app -t ruby:2.6 /bin/bash
# Open port
sudo docker run -i -v "$PWD":/usr/src/app -p 4000:4000 -t ruby:2.6 /bin/bash 

JEKYLL_ENV=production bundle exec jekyll serve
# Debug, verbose
JEKYLL_ENV=production bundle exec jekyll serve -V

# copy Docker images from one host to another
# you use exported file system for creating a new image then 
# this new image will not contain any USER, EXPOSE, RUN etc. commands from your Dockerfile.
# >>>> DO NOT USE docker export

sudo docker save -o ~/working/VMs/docker_jekyll-text-theme_dev_tuyenld.tar docker_jekyll-text-theme_dev_tuyenld:latest
docker load -i ~/working/VMs/docker_jekyll-text-theme_dev_tuyenld.tar

```