const { Schema } = require('mongoose');

const pollSchema = new Schema({
  caption: { type: String, required: true },
  choices: [
    {
      body: { type: String, required: true },
      seq: { type: Number, default: 0 },
      votes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
          },
          createdAt: { type: String, default: () => new Date().toISOString() },
        },
      ],
    },
  ],
});

module.exports = pollSchema;
