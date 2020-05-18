const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    /**
     * Get the token transmitted by the user.
     * */
    const {token} = socket.handshake.query;

    /**
     * If there is no token, return the error.
     * */
    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    /**
     * Find the session by the transmitted token.
     * */
    const session = await Session.findOne({token}).populate('user');

    /**
     * If there is no session, return the error.
     * */
    if (!session) {
      return next(new Error('wrong or expired session token'));
    }
    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {

      /**
       * For every user message, save it to the DB.
       * */
      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user._id,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
