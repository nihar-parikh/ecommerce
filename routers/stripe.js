import express from "express";
import Stripe from "stripe";

const router = express.Router();

//STRIPE_KEY should be private key from stripe api
const stripe = new Stripe(process.env.STRIPE_KEY); //new stripe instance

// console.log(stripe);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId, //token will be returned by client side stripe payment
      amount: req.body.amount, //creating stripe payment object with these key-value pairs
      currency: "INR",
    },
    (stripeError, stripeRes) => {
      if (stripeError) {
        res.status(500).send(stripeError);
      } else {
        res.status(200).send(stripeRes);
      }
    }
  );
});

export default router;
