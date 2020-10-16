## Starter app for REST Api built with Express / mongoose

## Node js app

- install node
- npm install


## MongoDb

- Setup follow https://docs.mongodb.com/manual/administration/install-community/
- for macOSX https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

- brew services start mongodb-community@4.4 // start service
- brew services stop mongodb-community@4.4 // stop service
- mongo // to begin using mongoDB

- mongoimport --db simple --collection people --jsonArray users.json //Insert from terminal
- go to mongo shell
- use simple // create/select a db
- db.people.findOne() // see one entry in collection people
- db.people.remove() // to remove the collection
- db.dropDatabase() // delete a db
- show dbs
- update db connect url in .env file
- npm start

## API

- Signup
- login
- CRUD user
- follow/unfollow

- Posts
- CRUD Posts
- comments/lkes
- home/{username}


## References
- https://zellwk.com/blog/crud-express-mongodb/

## prerequisites

1. Node https://nodejs.org/en/
2. Atlas setup https://docs.atlas.mongodb.com/tutorial/create-atlas-account/
3. Compass https://www.mongodb.com/products/compass
4. Postman https://www.postman.com/



## Backend for instagram clone

https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
