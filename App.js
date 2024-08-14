const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_51PngWrRx1eXuBKUDpHlqxubWDz9SyGHW9A0KvOFD66DWRGaBJH8mpmupEvzeKqkfK0Fj1W0fVREM22bEq8Ws5j9H006htS8CrB");

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

app.post("/create-payment-intent", async (req, res) => {
  const items = req.body.items; 

  try {
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(8080, () => console.log("Node server listening on port 8080!"));
