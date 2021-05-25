import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(cors({
	credentials: true,
	origin: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('server/public'));

//use both dist and uploads as static dirs
app.use(express.static('dist'));
app.use('/uploads', express.static('server/uploads'));

//routes
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(4000, () => {
	console.log(`listening on port ${4000}`);
});

//error handler
app.use((err, req, res, next) => {
	console.log(err);
});
