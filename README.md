# camille
Bot pour le serveur discord "Shinsetsu Kurabu"

<br/><br/>

## How to run

### Setup
- First you need to install [Node.js (LTS)](https://nodejs.org/en/) and [Git](https://git-scm.com/)
- After, clone this git using
```
git clone https://github.com/NonoIceOff/camille
```
- Then, go to the bot folder and install dependencies using these commands
```
cd camille
npm i
```
- Finally, make a file called `config.js` with the token of your bot, example:
```js
module.exports = {
    token: "NTAwNTYxODc4MzDSMS-DOSMg.GYna_5.nJG-9ZdGD_US2nGLAfDSflopjbOquxidfnODC5", // Token used when test = 0
    testToken:"ODAzdfdsnfnj7VzUxODA1.GI1mU1.ILDSOvkxzpLINUX46ZMQn0J6MHX69pcvxl.SQKI", // Token used when test = 1
};
```
### Run
- To run the bot, you have to enter the following command
```
node ./index.js
```
