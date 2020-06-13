# Angular application to view the workout analytics

App URL: https://matobio.github.io/workout-analytics-app/

## The data

This is an angular application which it get and write the data into a [Firebase Realtime Database](https://firebase.google.com/).

## App deployment

The app is deployed with [GitHub Pages](https://pages.github.com/). 


### How to deploy an angular application on GitHub

[Tutorial source](https://roelofjanelsinga.com/articles/how-to-set-up-automatically-deploy-website-github-pages)


1. Commit your angular proyect files to your master branch.
2. Enable GitHub Pages on the repository.
   - Create the "gh-pages" branch, click on "Branch: master" and type gh-pages.
   ![""](https://github.com/matobio/workout-analytics-app/blob/master/imagen1.PNG)
   - You will now have two branches in your repository: master and gh-pages. To enable GitHub Pages on your repository, click on "Settings" and scroll down the "GitHub Pages" section. You should see something like this:
   ![""](https://github.com/matobio/workout-analytics-app/blob/master/imagen2.PNG)
3. Install "husky":
```
> npm install --save-dev husky 
```
4. Now, in our package.json file, include the following configuration:
```
{
    // Sscripts, dependencies, etc.
    "husky": {
        "hooks": {
          "pre-commit": "npm run prod"
        }
    }
}
```
   - Now, every time we commit a change in Git, "npm run prod" will be executed. You can replace this with your own build script, for example: "gulp build" or "webpack". In the case of my simplistic project, this could mean that we copy the index.html file to dist/index.html.
5. One last thing that we need to do is add new scripts to your package.json:
```
{
    // dependencies, etc.
    "scripts": {
        "prod": "echo \"Add your build command here\"",
        "postinstall": "node ./node_modules/husky/lib/installer/bin install",
        "deploy": "git push origin `git subtree split --prefix dist master`:gh-pages --force"
    }
    // husky, etc. 
}
```
   - The "postinstall" script executes after you run "npm install". This makes sure that husky runs properly. I recommend you run "npm run postinstall" to be certain that husky has done what it needs to do. The deploy command will be needed in the next step, so just copy and paste it for now.
Now our code will be built every time we commit a change, without having to think about it. Just how we like it.

### Automate your deployment process

We've already automated the build process, so now we can automate the deployment process. For this, we're going to make use of GitHub Actions. This sounds very intimidating, but I'll explain exactly what's going on and I'll give you the configuration you need for this to work.

First of all, let's click "Actions" in your repository. Then click on "Set up a workflow yourself" on the right side. Remove everything that's there and paste this instead:
```
# This script deploys your website automatically
name: CI

# Only trigger this script when you push to the master branch
on:
  push:
    branches: [ master ]

# Specify the tasks to run when this script gets triggered
jobs:
  build:
    runs-on: ubuntu-latest

    # Download our master branch
    steps:
    - uses: actions/checkout@v2

    # Run our deployment command
    - name: Deploying the static website to gh-pages
      run: npm run deploy
```
This configuration takes care of deploying your website automatically when you push changes to the master branch. All the way at the bottom you can see that we execute "npm run deploy". This is the script that we added to our package.json in step 5. When you run "npm run deploy", the following command will get executed:
```
git push origin `git subtree split --prefix dist master`:gh-pages --force
```
This command pushes a single folder, in this case "dist", to the gh-pages branch. That is the branch that we chose as our production branch in GitHub. This command will get executed every time we push to the master branch. Now every time you push your changes, GitHub Actions will automatically publish your "dist" folder. So that's another thing you don't have to think about anymore when deploying to GitHub Pages.







