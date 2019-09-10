# express-typescript-seed

## Introduction

Nowadays, developers are concerned about type-safety of a programming language because type-safe code is less error prone and is more readable. In short, type-safe code can shorten the development life cycle and reduce the technical debt, theoretically.

[Here is an article about the advantage of type-safety](https://dzone.com/articles/writing-typesafe-and-lean)

Node.js, becomes popular given with its features like event driven, non blocking I/O model that contribute to its lightweight and efficiency. However, it is also being critizied about its non type-safety and this critism gives birth to another language, TypeScript. A language that is built by Microsoft that aims to extend Node.js by adding type-safety to the language.

We believe TypeScript is the way to make the best of Node.js and it is the future of Node.js development. Regretfully, there are not too many resources on the internet that provides a solid example about how to do things in TypeScript (almost all of them are written in Node.js!!!).

## Getting started

We are here aiming to provide a boilerplate example of a Express in MVC pattern that is developed in TypeScript that has integrated most of the popular backend toolkits (e.g. Express, Mongoose, Passport.js, Nodemailer) that demonstrates the API call to register and authenticate a user.

## Features & Dependencies

* [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - InversifyJS is a lightweight inversion of control (IoC) container for TypeScript and JavaScript apps. The inversify-express-utils extends this by adding decorators to the controllers in that the development is kinda like Spring Boot. In this example, we have demonstrated dependency injections by using InversifyJS.
* [mongoose](https://mongoosejs.com/) - Every web app must be backed by a database and MongoDB is the most popular database that is chosen in the Node.js community. In this example, we have also demonstrated the integration of CRUD operations into the Express web app with TypeScript by using the mongoose ODM library (with the model class, DAO that are written in TypeScript).
* [passport.js](http://www.passportjs.org/) - Passport.js is authentication middleware for Node.js and it supports authentication using a username and password, and third-party OAUTH like Facebook, Twitter, and more. There are plenty of example demonstrating the use of Passport.js in Node.js. However, it lacks a concise example of how Passport.js can be integrated with TypeScript, especially the mixture of InversifyJS and Passport.js, like how to configure Passport.js in a dependency injectable manner. In this example, we are trying to give a demonstration of intregrating Passport.js as a authentication middleware into the inversify-express.
* [nodemailer](https://nodemailer.com/about/) - Nodemailer is a module for Node.js applications to allow easy as cake email sending. In this example, we have demonstrated how to create an email template with the template engine [mustache.js](https://github.com/janl/mustache.js/) and finally send it out by using the Nodemailer library with TypeScript.
* [swagger](https://swagger.io/) - Swagger is also a greate tool forster the communication between the backend engineers and frontend engineers. We believe the swagger document takes a heavy role in mordern development and thus in this example, we have also demonstrated how to integrate swagger into the inversify-express.

## Installation

We suggest using `yarn` to run this project and you need to `yarn` installed on your system. After you have cloned this project to your local computer, you can run the following command to install all the required dependencies.

```
yarn
```

After that, you will need to install `ts-node` and `nodemon` globally on your system by running the following command.

```
yarn global add ts-node
yarn global add nodemon
```

Next, since in this example we are also demonstrating the authentication with Facebook OAUTH, thus you also need to provide the FACEBOOK_APP_ID and FACEBOOK_APP_SECRET.

```
export FACEBOOK_APP_ID="<facebook app id>"
export FACEBOOK_APP_SECRET="<facebook app secret>"
```

If you don't need that in your application, you can always comment or remove the lines in the passport configurations, which is located in `src/services/passport/index.ts` and line 170.

```
// comment out these lines
const FacebookTokenStrategy = passportFacebookToken;
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    // Get additional fields.  All fields available at https://developers.facebook.com/docs/graph-api/reference/v2.7/user
    profileFields: ['email', 'picture', 'name']
},
```

After that, you should be good to go to execute the project by typing the following command.

```
yarn dev
```

This will start the `nodemon` which reads the `nodemon.json` file in the project. Beware that changing any files with extension `.ts` will trigger the restart of the entire program.

To compile the program, you can run the following command.

```
yarn build
```

This will trigger the `tsc` command to compile the entire project into JavaScript and all the JS files will be placed in a directory called `dist`, which will be generated automatically by yarn script.

Next, if you want to run the compiled version of the project instead of the developement script, you can run the following command to do so.

```
yarn start
```

If you start the program in this way, then it will attempt to look for the `index.js` file in the `dist` directory. So, you need to make sure that the project is compiled properly before running the above command. Starting the program in this way is more encourged in the production environment. In the `Dockerfile`, we have also demonstrated building the docker container in this way.

## TODO

- [ ] Beautify the import statement to avoid (../../)
- [ ] Avoid the use of // @ts-ignore

## Pull request

If you find this project/example is useful, feel free to fork or clone it.

We understand that this project/example is far from perfect and we will continuatously work on in order to improve it. Also, we deem the proverb that "Two heads are better than one" and your aids are very important to us.

Pull request are always welcome and let's make this project better!!!
