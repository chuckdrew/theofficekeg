# The Office Keg
Node.js app to manage the office keg. This is my first node app, so go easy on me :)

We have a kegerator in our office but it is not company sponsored, so we have to charge money for each pint to keep it funded. This app was built to keep track of peoples tabs.

The app requires MongoDB, Node JS, and Compass CSS -  so the first step is to get all those items running. If you are on OSx,  just run the commands I listed below.

Mongo: https://www.mongodb.org/downloads (OSx: brew install mongodb)
Compass: http://compass-style.org/install/ (OSx: gem install compass)
Node JS: https://nodejs.org/download/ (OSx: brew install node)

##Getting the app running

##### 1. After you clone the repo, go to the app's base directory. ie:
```
cd ~/dev/theofficekeg
```
##### 2. Create local config file
```
cp env.example .env
```
##### 3. Add your own config values.
```
vi .env
```
##### 4. Install Node Modules:
```
npm install
```
##### 5.Start the Server
```
node server.js
```
##### 6. Check if the app is running in your browser. By default, it runs on port 8081.
```
http://localhost:8081
```

## CSS Changes

The frontend using sass/compass to compile the CSS. Follow these steps to get it running. I've been committing the compiled CSS to GIT, but I really should be ignoring the compiled CSS and running the compilation at deployment time.

##### 1. Install Compass
```
Follow these instructions: http://compass-style.org/install/
```
##### 2. cd into the app's sass directory.
```
cd ~/dev/theofficekeg/public/css
```
##### 3. Run compass (there are many options to run, but mostly I just run "watch" command).
```
compass watch

```
To compress CSS for prod:
```
compass watch -e production
```