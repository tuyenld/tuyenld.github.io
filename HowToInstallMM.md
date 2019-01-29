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

vi _config.yml
```
# Add at the end of file
# deployment
host: 0.0.0.0
port: 5000
```
bundle exec jekyll serve
