# food-app
The app consists of two express apis, the /api and the /exchange-api. To use the app, you need both express servers up and running.

## Instructions

### Prerequisites

##### Node
You will need a reasonably recent Node version like 18 or 20, npm and npx.

##### Database
You need access to a MongoDB cluster, in replica set mode. The cluster can contain only one node, but it being part of a replica set is mandatory. A default free-tier Atlas Mongo instance should suffice as it was used for the development process. If not refer to the Atlas Mongo deployment docs [here](https://www.mongodb.com/docs/cloud-manager/tutorial/deploy-replica-set/).

##### Fixer api key
You need a Fixer api key to use the Fixer api, wrapped by the exchange-api node app. Follow the instructions [here](https://fixer.io/).

### .env files

You need a .env file in both ```/api``` and ```/exchange-api```. In each directory you can find a template.env file. This file contains the mandatory env variables for both apps. By default ```/api``` runs at port 7001 and ```/exchange-api``` at port 7002. You can change the ports, but, since ```/api``` depends on ```/exchange-api```, you need to specify the correct ```EXCHANGE_API_BASE_URL``` in the ```/api``` .env file.

```/exchange-api``` authenticates apps with a static app API key and app name. These need to be specified as ```SEED_INITIAL_USER```, ```SEED_INITIAL_API_KEY``` in ```/exchange-api``` .env and as ```EXCHANGE_API_APP_NAME```, ```EXCHANGE_API_API_KEY``` in ```/api``` .env.

In ```/api```, merchants authenticate with a username, password combination. You can specify them in ```\api```'s .env file. To login, use ```your_username@your_username.com``` as email. 

You can check the app wide ```settings``` object in each app's code, for further information. For your convenience, the template.env files have compatible env variables for both apps. The only ones that you really need to change are:

- DATABASE_URL in ```/api``` and specifically username, password and url. Preferably, leave the DB name(foodAppDB) as is.
- DATABASE_URL in ```/exchange-api``` and specifically username, password and url. Preferably, leave the DB name(FixerExchangeRate) as is.
- FIXER_API_KEY in ```/exchange-api```

### Install

Once you setup the .env files in both directories, the following commands need to be executed for both the ```/api``` and ```/exchange-api```, so ```cd``` into each one and do:

```
npm i
npx prisma generate
npx prisma db push
npm run seed
```

### Run

If everything went well, you can start each app by ```cd``` into the corresponding directory and run

```
npm run dev
```

for the nodemon restart-on-save development server or 

```
npm run start
```

for a plain old Node server.

## Usage
...
