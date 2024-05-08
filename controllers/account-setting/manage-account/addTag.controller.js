'use strict';

const tagModel = require('../../models/tags.model');

const addTagController = async (req, res, next) => {
	try {
		let { name, colorHex } = req.body;
		const { id } = req.params;

		//check tag existence
		let tagExist = await tagModel.findOne({ name });

		if (tagExist) {
			return res.status(409).send({
				code: res.statusCode,
				message: 'tag already exists'
			});
		}

		let tag = await tagModel.create({
			name,
			colorHex,
			addedBy: id
		});

		if (tag)
			return res.status(201).send({
				code: res.statusCode,
				message: 'tag created successfully',
				tag
			});
	} catch (error) {
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = addTagController;