import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  emptyBasket,
  selectBasket,
  selectPaidCOrders,
  selectUser,
  setPaidOrders,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "../axios";
import { db } from "../firebase";
import CurrencyFormat from "react-currency-format";
import { makeStyles, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardPayment: {
    padding: 10,
  },

  cardElement: {
    padding: 10,
  },

  pricecontainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    columnGap: 30,
  },
}));
const Checkout = () => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);
  const [totalInBasket, setTotalInBasket] = useState(0);

  const user = useSelector(selectUser);
  const basket = useSelector(selectBasket);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (event) => {
    // do all the fancy stripe stuff...
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation

        db.collection("customers")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            email: user.email,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        //   setDogStyles((previous) => {
        //     return {
        //       ...previous,
        //       opacity: 1,
        //       transform: `translate(${0}px, ${-100}px)`,
        //     };
        //   });

        setTimeout(() => {
          // setDogStyles((previous) => {
          //   return { ...previous, opacity: 0, top: 0, zIndex: -1 };
          // });

          setSucceeded(false);
          setError(null);
          setProcessing("");
          setDisabled(true);
          dispatch(emptyBasket());
          history.replace("/");
        }, 1000);
      });
  };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  useEffect(() => {
    const getTotalInBasket = () => {
      console.log("basket >>>", basket);
      let total = 0;
      for (let order of basket) {
        const p = +order?.price?.raw;
        total += p;
      }

      setTotalInBasket(total);
    };
    getTotalInBasket();
    // generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits
        url: `/payments/create?total=${totalInBasket * 100}`,
      });

      console.log("AXIOS RESPONSE >>>>", response);
      setClientSecret(response.data.clientSecret);
    };

    if (parseInt(totalInBasket) == 0) return;
    getClientSecret();
  }, [totalInBasket]);

  return (
    <form className={classes.cardPayment} onSubmit={handleSubmit}>
      <>
        <CardElement className={classes.cardElement} onChange={handleChange} />
        <div className={classes.pricecontainer}>
          <CurrencyFormat
            renderText={(value) => (
              <Typography
                style={{
                  marginTop: "0.6rem",
                  marginBottom: "0.6rem",
                }}
                variant="body2"
                component="h5"
              >
                Your Total: {value}
              </Typography>
            )}
            decimalScale={2}
            value={totalInBasket || 0}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />
          <Button
            type="submit"
            fullWidth
            color="secondary"
            variant="outlined"
            disabled={processing || disabled || succeeded}
          >
            <span> {processing ? <p> Processing </p> : "Buy Now"}</span>
          </Button>
        </div>
      </>
      {/* Errors */} {error && <div> {error} </div>}
    </form>
  );
};

export default Checkout;
