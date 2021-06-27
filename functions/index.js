const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51HQBlEEdxauSUfDOnAwzm7nfOB75iFcspX0IVYwAcrxmaWzSPrN1PxnNCKnIbzypioeYHmcZqfvpvisY4AHL8YZm00W75VU5PU"
);

// - APP CONFIG
const app = express();
// - MIDDLEWARES
app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());
// - API ROUTES
// app.get("/", (request, response) => response.status(200).send("Hello world"));
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("Payment Request Received BOOM!!! for this amount >>> ", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of the currency
    currency: "usd",
  });

  // OK - CREATED
  response.status(202).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// - LISTEN COMMAND
exports.api = functions.https.onRequest(app);
