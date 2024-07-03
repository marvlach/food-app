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

Below, you can find some examples of the requests.

### As a guest

A guest needs to "authenticate" by calling ```GET /auth/login``` endpoint and getting a HTTP-only cookie. With this cookie, the guest can place orders and get their own orders. If the cookie is removed from the guest's client, they can no longer place orders or get their past orders. The cookie value is the Mongo user id, so if you lose the cookie, head to Atlas, find the user in the user collection and get it's id.

```
curl --location 'http://localhost:7001/auth/login' \
--data ''
```

To get available currencies(usefull to fill a dropdown select component in a UI), you can ```GET /currency```. You don't really need a cookie to get the currencies. 

```
curl --location 'http://localhost:7001/currency' \
--header 'Cookie: guest_user_id=66853fba82b75b2dbc0e338e' \
--data ''
```

To get the menu you can ```GET /menu``` and optionally specify a query parameter ```currency=AED``` with one of the supported currencies. 

```
curl --location 'http://localhost:7001/menu?currency=AED' \
--header 'Cookie: guest_user_id=66853fba82b75b2dbc0e338e' \
--data ''
```

To place an order you need to ```POST /order``` with the a request body like below, where "item_id" correspond to ids of the Mongo item collection.

```
curl --location 'http://localhost:7001/order' \
--header 'Content-Type: application/json' \
--header 'Cookie: guest_user_id=66853fba82b75b2dbc0e338e' \
--data '{
    "currency": "USD",
    "address": "Vas. Sofias 5, Chaidari, Athens",
    "order_items": [
        {
            "item_id": "668539f29b0bd15ecc4e9d19",
            "quantity": 1,
            "comment": "xwris alati" 
        },
        {
            "item_id": "668539f39b0bd15ecc4e9d1f",
            "quantity": 3,
            "comment": "xwris patates"
        }, 
        {
            "item_id": "668539f39b0bd15ecc4e9d21",
            "quantity": 5,
            "comment": ""
        }
    ]
}'
```

A guest can get their orders by calling the ```GET /order``` endpoint to get a json response or ```GET /order?view=whatever``` to get an HTML response.

```
curl --location 'http://localhost:7001/order' \
--header 'Cookie: guest_user_id=668544bb82b75b2dbc0e3393' \
--data ''

curl --location 'http://localhost:7001/order?view=12' \
--header 'Cookie: guest_user_id=668544bb82b75b2dbc0e3393' \
--data ''
```

### As a merchant

The merchant was seeded in the DB during the installation process. You can login with the email, password you provided in the .env file. If you left them as they were in the template.env, the request is the following. The response will contain a JWT. You will need to manually attach it to the request header like below, in the subsequest requests. 

```
curl --location 'http://localhost:7001/auth/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: guest_user_id=668544bb82b75b2dbc0e3393' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}'
```

To get all the orders in json

```
curl --location 'http://localhost:7001/order' \
--header 'Authorization: Bearer yourJWT' \
--data ''
```

and to get all orders in HTML

```
curl --location 'http://localhost:7001/order?view=whateva' \
--header 'Authorization: Bearer yourJWT' \
--data ''
```

## Test

To run the tests:

```
cd api
npm run coverage
```
