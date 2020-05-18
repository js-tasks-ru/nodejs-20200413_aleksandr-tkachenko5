const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  /**
   * Get the order data
   * */
  const orderData = ctx.request.body;

  /**
   * Get the user data
   * */
  const user = ctx.user;

  /**
   * Create a new order
   * */
  const order = await Order.create({
    user,
    product: orderData.product,
    phone: orderData.phone,
    address: orderData.address,
  });

  /**
   * Find the product info
   * */
  const product = await Product.findOne({_id: orderData.product});

  /**
   * Info that will be send to the user by email
   * */
  const mailOpts = {
    template: 'order-confirmation',
    locals: {product},
    to: user.email,
    subject: 'Verify your email, please',
  };

  /**
   * Send the email with order info
   * */
  await sendMail(mailOpts);

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  /**
   * Get the user id
   * */
  const user = ctx.user._id;

  /**
   * Get the orders list related to the user
   * */
  const orders = await Order.find({user});

  ctx.body = {orders};
};
