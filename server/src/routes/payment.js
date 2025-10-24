const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constant");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { memberShipType } = req.body;
    const typeKey = memberShipType.toLowerCase();

    if (!memberShipAmount[typeKey]) {
      return res.status(400).json({ msg: "Invalid membership type" });
    }

    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[typeKey] * 100, // in paise
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId,
        memberShipType: typeKey,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    // 1. Get webhook signature from headers (corrected)
    const webhookSignature = req.headers["x-razorpay-signature"]; // Note: headers are lowercase
    
    // 2. Get the raw request body for signature validation
    const webhookBody = JSON.stringify(req.body);
    
    // 3. Validate webhook signature
    const isWebhookValid = validateWebhookSignature(
      webhookBody,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // 4. Handle different webhook events
    const event = req.body.event;
    const paymentDetails = req.body.payload.payment.entity;

    // Find the payment record
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (!payment) {
      return res.status(404).json({ msg: "Payment record not found" });
    }

    // Update payment status
    payment.status = paymentDetails.status;
    await payment.save();

    // Handle specific events
    if (event === "payment.captured") {
      // Update user to premium only for successful payments
      const user = await User.findOne({ _id: payment.userId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      
      user.isPremium = true;
      user.memberShipType = payment.notes.memberShipType;
      await user.save();
      
      console.log(`User ${user._id} upgraded to premium`);
      
    } else if (event === "payment.failed") {
      // Handle failed payment - maybe send notification
      console.log(`Payment failed for order: ${paymentDetails.order_id}`);
      // You might want to update user status or send email here
    }

    // 5. Always send response to Razorpay
    res.status(200).json({ msg: "Webhook processed successfully" });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
