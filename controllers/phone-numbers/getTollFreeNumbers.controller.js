'use strict';
const { env } = require('process');

const getTollFreeNumbers = async (req, res, next) => {
	try {    

    //Create a Twilio client
    const client = require('twilio')(
      env.TWILIO_ACCOUNT_SID,
      env.TWILIO_AUTH_TOKEN
    );

    //Retrieve local phone numbers
    return client.availablePhoneNumbers('US')
    .tollFree.list()

    .then((tollFreeNumbers) => {
        return res.status(200).send({
            code: res.statusCode,
            message: 'Toll free numbers retrieved successfully',
            tollFreeNumbers
        });
        }
    )

	} catch (error) {
    return res.status(500).send({
      code: 500,
      error: { message: 'An internal server error occurred' },
    });
	}
};

module.exports = getTollFreeNumbers;
