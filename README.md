# GameHub

Multiplayer game portal written in VueJS that let's you play realtime javascript/canvas games against other players.
It uses a MySQL database and Socket.io for the realtime communication between the clients.

## Notable folders

> [/server](https://github.com/gryp17/game-hub/blob/master/server) - contains the server side logic

> [/src](https://github.com/gryp17/game-hub/blob/master/src) - contains the VueJS client side logic

> [/games](https://github.com/gryp17/game-hub/blob/master/games) - contains the games files

## Configuration
The frontend configuration file containing the API server URLs is located in

> [/src/config.js](https://github.com/gryp17/game-hub/blob/master/src/config.js)

The backend development configuration file containing the database configuration and other application/game parameters is located in

> [/config/development.js](https://github.com/gryp17/game-hub/blob/master/server/config/development.js)

## Project setup
Configure the database parameters, CDN url, application port... and then run the following commands:

Install the dependencies
```
npm install
```

Creates the database tables and inserts seed data in development mode
```
npm run sync-models-dev
```

Create the database tables in production mode
```
npm run sync-models
```

### Builds the frontend assets in development mode
```
npm run build-dev
```

### Builds the frontend assets in production mode
```
npm run build
```

### Runs the API in development mode
```
npm run start-dev
```

### Runs the API in production mode
```
npm run start
```

### Lints and fixes files
```
npm run lint
```
