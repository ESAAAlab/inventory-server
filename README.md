# inventory-server

Tool lending server, backend to [inventory-app](https://github.com/ESAAAlab/inventory-app)

#### Build Setup

``` bash
# install dependencies
npm install

# serve API at localhost:3000, webapp at localhost:3050
npm run start
```

#### Environnement variables to set

``` bash
# ports for api & webapp
API_PORT : default 3000
WEBAPP_PORT : default 3050
# select which DB to use
NODE_ENV : development, development_local, production, production_local
```

#### resin.io deployment

This simple server can be run on a raspberry pi using [resin.io][resin-link]

To get this project up and running, you will need to signup for a resin.io account [here][signup-page] and set up a device, have a look at our [Getting Started tutorial][gettingStarted-link]. Once you are set up with resin.io, you will need to clone this repo locally:

```
$ git clone git@github.com:ESAAAlab/inventory-server.git
```
Then add your resin.io application's remote repository to your local repository:
```
$ git remote add resin username@git.resin.io:username/myapp.git
```
Take a look at Dockerfile.template and initDB.sh to configure your image for your network, and change the default passwords for postgres and inventory users.
Then push the code to the newly added remote:
```
$ git push resin master
```
It should take a few minutes for the code to push.
Don't forget to set the environment variables in your application dashboard.

---

This project was inspired by [Michael Herman](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.VijvshNViko)

[resin-link]:https://resin.io/

[signup-page]:https://dashboard.resin.io/signup

[gettingStarted-link]:http://docs.resin.io/#/pages/installing/gettingStarted.md
