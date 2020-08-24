# Rakefile provided by http://blog.sorryapp.com/edging-with-jekyll/2014/01/31/using-jekyll-plugins-on-github-pages.html

# To run: rake ed:publish

# Require jekyll to compile the site.

require "jekyll"

# Call method
require 'tmpdir'

# Github pages publishing.
namespace :ed do
  #
  # Because we are using 3rd party plugins for jekyll to manage the asset pipeline
  # and suchlike we are unable to just branch the code, we have to process the site
  # localy before pushing it to the branch to publish.
  #
  # We built this little rake task to help make that a little bit eaiser.
  #

  # To publish your site:
  # bundle exec rake ed:publish


  desc "Publish ed to gh-pages"
  task :publish,  :repo do |t, args|
    puts "Set up github pages"
    if args.repo
      repo_url = args.repo
      # Compile the Jekyll site using the config.
      Jekyll::Site.new(Jekyll.configuration({
        "source"      => ".",
        "destination" => "_site",
        "config" => "_config.yml"
      })).process

      # Make a temporary directory for the build before production release.
      # This will be torn down once the task is complete.
      Dir.mktmpdir do |tmp|

        temporary_dir = Time.now.strftime('%Y-%m-%d-%H_%M_%S')
        system "git clone #{repo_url} #{temporary_dir}"
        cp_r "#{temporary_dir}/.git", tmp
        # Copy accross our compiled _site directory.
        cp_r "_site/.", tmp
        system "rm -rf #{temporary_dir}"

        # Switch in to the tmp dir.
        Dir.chdir tmp

        # Prepare all the content in the repo for deployment.
        system "git add . && git commit -m 'Site updated at #{Time.now.utc}'" # Add and commit all the files.

        # Push the files to the gh-pages branch, forcing an overwrite.
        system "git push origin master"
      end

      # Done.
    else
      puts "Syntax error: ed:publish contains unsupported repo e.g rake ed:publish[$REPO_URL]"
    end
  end
end
