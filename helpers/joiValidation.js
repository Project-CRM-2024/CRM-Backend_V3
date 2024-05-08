const httpStatus = require('http-status');

const validateSchema = ({ body, params }) => {
	return (req, res, next) => {
		// Validate request body
		if (body) {
			const { error: bodyError } = body.validate(req.body);
			if (bodyError) {
				return res.status(httpStatus.BAD_REQUEST).json({ error: bodyError.details[0].message });
			}
		}

		// Validate request params
		if (params) {
			const { error: paramsError } = params.validate(req.params);
			if (paramsError) {
				return res.status(httpStatus.BAD_REQUEST).json({ error: paramsError.details[0].message });
			}
		}

		next();
	};
};

module.exports = validateSchema;
