'use strict';
const bcrypt = require('bcrypt');
const UserModel = require('../../models/user.model');

const registerController = async (req, res, next) => {
    const { firstName, lastName, password, email, role } = req.body;

    try {
        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        
		// Number of rounds hash function will execute
		const salt = await bcrypt.genSalt(10);

        // Hash the password before saving
		const hashedPassword = await bcrypt.hashSync(password, salt);

        // Create a new user
        const newUser = new UserModel({
            firstName,
			lastName,
            password: hashedPassword,
            email,
            role: role || 'CRM_USER' // Default role to 'CRM_USER' if not specified
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = registerController;
