const mongoose = require('mongoose');
const connection = require('../libs/connection');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

});

/**
 * Get the formatted history of the messages.
 * */
messageSchema.statics.getFormattedMessageList = async function() {
  /**
   * For the testing purposes we limit it to 1.
   * Should be ~20.
   * */
  const messageList = await this.find({}).limit(1);
  return messageList.map((item) => {
    return {
      date: item.date,
      id: item._id,
      text: item.text,
      user: item.user,
    };
  });
};

module.exports = connection.model('Message', messageSchema);
