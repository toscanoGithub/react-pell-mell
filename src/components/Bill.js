import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { selectBasket, selectUser, setUser } from "../features/user/userSlice";
import formatCurrency from "../helpers/utils";

import { BsQuestionDiamond } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    minWidth: 380,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  header: {
    marginBottom: 10,
    "&>h6": {
      color: "#aaa",
      fontSize: "0.8rem",
    },
    row: {
      "&>h6": {
        fontSize: "1rem",
      },
    },
  },

  body: {
    margin: "10px auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    rowGap: 30,
  },

  footer: {},

  accordion: {
    height: "auto",
    marginTop: 10,
  },
  accordionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkoutBtn: {
    backgroundColor: "#6F7A94",
    color: "white",
    "&:hover": {
      backgroundColor: "#6F7A94",
      color: "white",
    },
  },
}));
const Bill = () => {
  const classes = useStyles();
  const basket = useSelector(selectBasket);
  const [subtotal, setSubtotal] = useState(0);
  const history = useHistory();
  const [toggleAccordion, setToggleAccordion] = useState(false);
const dispatch = useDispatch()
  // check auth
  const user = useSelector(selectUser);
  useEffect(() => {
    const getSubtotal = () => {
      setSubtotal(
        basket
          .map((item) => +item.price.raw)
          .reduce((acc, value) => acc + value)
      );
    };
    getSubtotal();
  }, [basket]);

  const checkoutClicked = () => {
    history.push(`${user ? "/checkout" : "/authenticate"}`);
  }
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="subtitle2">ORDER SUMMARY</Typography>
        <Typography variant="subtitle2">CACART335716193</Typography>
      </div>
      <Divider light />
      <div className={classes.body}>
        <div className={classes.row}>
          <Typography variant="subtitle2">Subtotal</Typography>
          <Typography variant="subtitle2">
            {formatCurrency(subtotal)}
          </Typography>
        </div>

        <div className={classes.row}>
          <Typography variant="subtitle2">Shipping</Typography>
          <Typography variant="subtitle2">Free (Standard Shipping)</Typography>
        </div>

        <div className={classes.row}>
          <Typography variant="subtitle2">Estimated Tax</Typography>
          <Typography variant="subtitle2" component={Link} to="#">
            Calculate
          </Typography>
        </div>

        <div className={classes.row}>
          <Typography>Estimated Total</Typography>
          <Typography>{formatCurrency(subtotal)}</Typography>
        </div>
      </div>
      <Divider light />
      <div className={classes.accordion}>
        <div className={classes.accordionHeader}>
          <Typography>View More</Typography>
          {toggleAccordion ? (
            <BiMinus
              style={{ cursor: "pointer" }}
              onClick={() => setToggleAccordion(false)}
            />
          ) : (
            <BiPlus
              style={{ cursor: "pointer" }}
              onClick={() => setToggleAccordion(true)}
            />
          )}
        </div>
        <Typography style={{ marginTop: 20 }} variant="subtitle2">
          You will be charged at the time of shipment. If this is a personalized
          or made-to-order purchase, you will be charged at the time of
          purchase.
        </Typography>

        <div
          className={classes.row}
          style={{
            marginBottom: `${!toggleAccordion ? "-30px" : "10px"}`,
            height: `${toggleAccordion ? "50px" : "30px"}`,
            transition: "all 700ms ease",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography variant="subtitle2">In Stock</Typography>
            <BsQuestionDiamond style={{ marginLeft: 10, cursor: "pointer" }} />
          </div>
          <Typography>{formatCurrency(subtotal)}</Typography>
        </div>

        <div className={classes.controls}>
          <Divider
            style={{
              marginBottom: `${toggleAccordion ? "20px" : "0px"}`,
              transition: "all 700ms ease",
            }}
            light
          />
          <Button
            className={classes.checkoutBtn}
            onClick={checkoutClicked}
            variant="contained"
            fullWidth
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
