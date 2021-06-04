import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import createMySQLStore from 'express-mysql-session';
import config from './config';
import { initSockets } from './sockets';
import { sendApiError } from './utils';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import matchmakingRoutes from './routes/matchmaking';

const app = module.exports = express();

app.use(cors({
	credentials: true,
	origin: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use both dist and uploads as static dirs
app.use(express.static('dist'));
app.use('/avatars', express.static('server/uploads/avatars'));

//create a session mysql store and save it in the app so that can be accessed from the other modules
const MySQLStore = createMySQLStore(session);
const sessionStore = new MySQLStore({
	host: config.db.host,
	database: config.db.database,
	user: config.db.user,
	password: config.db.password,
	schema: {
		tableName: config.session.tableName
	}
});

app.set('sessionStore', sessionStore);

app.use(session({
	store: sessionStore,
	secret: config.session.secret,
	name: config.session.sessionId,
	resave: true,
	saveUninitialized: false,
	//the session will expire if no activity in the next 72 hours
	rolling: true,
	cookie: {
		maxAge: 72 * 60 * 60 * 1000
	}
}));

//routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/matchmaking', matchmakingRoutes);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

const server = app.listen(config.port, () => {
	console.log(`listening on port ${config.port}`);
});

//setup the socket.io listeners
initSockets(server, app);

//catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handler
app.use((err, req, res, next) => {
	sendApiError(res, err);
});
