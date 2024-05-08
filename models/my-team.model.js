const { Schema, model } = require('mongoose');

const MyTeamSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		team: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'user',
					required: true
				},
				status: {
					type: String,
					enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
					default: 'PENDING',
					required: true
				}
			}
		],
		deletedAt: { type: Date, required: false, default: null },
	},
	{ timestamps: true }
);

const MyTeamModel = model('MyTeam', MyTeamSchema);

module.exports = MyTeamModel;
