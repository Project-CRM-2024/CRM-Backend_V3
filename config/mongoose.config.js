'use strict';
const mongoose = require('mongoose');
const { DB_URL, DB_NAME } = process.env;

const connectToDb = async () => {
	try {
		await mongoose.connect(`${DB_URL}/${DB_NAME}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			writeConcern: {
				w: 'majority'
			}
		});
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
	}
};

connectToDb();

const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
