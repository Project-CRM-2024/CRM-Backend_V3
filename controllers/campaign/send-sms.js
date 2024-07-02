'use strict';

const triggerScheduler = async (req, res) => {
	try {
		console.log('Called Scheduler');
		res
			.status(200)
			.send({ code: 200, message: 'Success' });
	} catch (error) {
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	triggerScheduler
};