# Hello and welcome to Team Rikers Meme Storage Service setup. 
## Prerequisites
#### You will need Node.js with NPM. You can find it [here](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac)
#### MongoDB for the database which you can find [here](https://www.mongodb.com/docs/manual/installation/)

#### The website code ofcourse: [here]()

## Installing and Configuring the website
##### Make sure that your Node.js with NPM install is working.
##### Make sure that you successfully install MongoDB
##### Run the following commands in order
1. ```npm init```
2. ```npm i express ejs mongoose```
3. ```npm i passport passport-local passport-local-mongoose express-session dotenv```
##### Now pelase type 
```npx nodemon``` 
#### it will be running on http://localhost:3000/

## Post setup troubleshooting

#### After you complete the installation, if it is not running on local host properly, then please change the following lines of code in app.js
`` line 52: change 0.0.0.0 to localhost`` 
`` line 77: change 0.0.0.0 to local host``
#### these changes need to be made, as when it was in development, it was faulty on my internet.
##### if you have any more issues, please do not hesitate to send me an email: mtzamanpk@gmail.com
