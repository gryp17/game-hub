# GameHub

Multiplayer game portal written in VueJS that let's you play realtime javascript/canvas games built with my own 2D game engine.
It uses a MySQL database and Socket.io for the realtime communication between the clients.

Currently live at: [https://game-hub.gryp.dev](https://game-hub.gryp.dev)

It has the following features:
* 3 playable games as of today (Pong, Volley, Jumper)
* Experience/rank based matchmaking
* Configurable game settings before each game (game speed, game length and other parameters)
* Configurable game controls and audio settings
* Touchscreen and keyboard controls
* Personalizable user profile (avatar, bio...)
* Realtime chat in the lobby
* User statuses

## Notable folders

> [/server](https://github.com/gryp17/game-hub/blob/main/server) - contains the server side logic

> [/src](https://github.com/gryp17/game-hub/blob/main/src) - contains the VueJS client side logic

> [/games](https://github.com/gryp17/game-hub/blob/main/games) - contains the games files

## Configuration
The frontend configuration file containing the API server URLs is located in

> [/src/config.js](https://github.com/gryp17/game-hub/blob/main/src/config.js)

The backend development configuration file containing the database configuration and other application/game parameters is located in

> [/config/development.js](https://github.com/gryp17/game-hub/blob/main/server/config/development.js)

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
