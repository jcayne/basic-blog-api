The API for a basic blog that displays text and allows for comments.

# Running the application
1. Install the pre-requisite software:
  - [Node.js](https://nodejs.org)
2. From the folder directory, install the Node.js dependencies:
  - `npm install`
3. Run the application:
  - `npm start`
4. In another terminal, run the tests:
  - `npm test`


# Release notes
- [v1.0.0](./README.md/#v100)

## v1.0.0
A basic REST API running on [Node.js](https://nodejs.org) using the [Express](http://expressjs.com) web application framework to respond to a POST request sent to [http://localhost:3100](http://localhost:3100) with a `200` response code and a text body of the provided text. Unit testing completed using the [Mocha JavaScript](https://mochajs.org) test framework. Swagger documentation specifications are hosted at [http://localhost:3100/swagger/swagger.json](http://localhost:3100/swagger/swagger.json).


### Updating Swagger
To update Swagger, use the [online editor](http://editor.swagger.io/#/).