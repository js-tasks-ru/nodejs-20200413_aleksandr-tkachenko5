const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.getFormattedMessageList();
  ctx.body = {messages};
};
