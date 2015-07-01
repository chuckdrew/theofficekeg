# The Office Keg
Node.js app to manage the office keg. This is my first node app, so go easy on me :)

We have a kegorator in our office but it is not company sponsored, so we have to charge money for each pint to keep it funded. This app was built to keep track of peoples tabs.

The app requires MongoDB so the first step is to get that running. On OSx using HomeBrew, just run: "brew install mongodb" and follow the instructions to get it started.

#Getting the app running

### 1. After you clone the repo, go to the directory base directory. ie:
```
cd ~/dev/theofficekeg
```
### 2. Create local config file
```
cp env.example .env
```
### 3. Add your config variable
```
vi .env
```
### 4. Install Node Modules:
```
npm install
```
### 5.Start the Server
```
node server.js
```
### 6. Check if the app is running in your browser. By default, it runs on port 8081.
```
http://localhost:8081
```