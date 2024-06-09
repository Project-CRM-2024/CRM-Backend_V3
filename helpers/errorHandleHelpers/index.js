const httpStatus = require('http-status');

const successResponseHandler = (res, data, message, next) => {
	res.status(200).send({
		status: httpStatus[200],
		success: true,
		message: message ?? 'Success',
		data
	});
	next?.();
};

const internalServerErrorHandler = (res, data, message) => {
	res.status(500).send({
		status: httpStatus[500],
		success: false,
		message: message ?? 'Interval Server Error',
		data
	});
};

const unauthorizedErrorHandler = (res) => {
	res.status(401).send({
		status: httpStatus[401],
		success: false,
		message: 'Unauthorized'
	});
};

const unprocessableEntityResponseHandler = (res) => {
	res.status(422).send({
		status: httpStatus[422],
		success: false,
		message: 'Unprocessable Entity!'
	});
};

const notFoundResponseHandler = (res, message, next) => {
	res.status(404).send({
		status: httpStatus[404],
		success: true,
		message: message ?? 'Success'
	});
	next?.();
};

module.exports = {
	successResponseHandler,
	internalServerErrorHandler,
	unauthorizedErrorHandler,
	unprocessableEntityResponseHandler,
	notFoundResponseHandler
};
