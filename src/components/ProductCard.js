import React, { useEffect, useState } from "react";
import {
  Divider,
  makeStyles,
  Paper,
  Typography,
  Slide,
  Avatar,
} from "@material-ui/core";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { GiCrossMark } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoBasket,
  removeformBasket,
  selectBasket,
  selectUser,
  setUser,
} from "../features/user/userSlice";

import { RiUserHeartLine } from "react-icons/ri";
import { useHistory, useLocation } from "react-router-dom";
import formatCurrency from "../helpers/utils";
import { stripHtml } from "string-strip-html";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: 300,
    height: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    [theme.breakpoints.down("xs")]: {
      //   backgroundPosition: "top",
      width: 350,
    },
  },
  productImage: {
    padding: 5,
    maxWidth: "100%",
    maxHeight: 200,
    objectFit: "contain",
  },
  productBody: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&>h6": {
      fontWeight: 700,
      fontSize:"0.8rem",
    },
  },

  productPrice: {
    paddingRight: 10,
    fontWeight: 700,
    fontSize: "0.7rem",
    color: "#5A4E4D",
  },
  dots: {
    cursor: "pointer",
  },
  details: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "80%",
    overflowY: "scroll",
    overflowX: "hidden",
    "&>svg": {
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer",
      zIndex: 100,
    },
  },
  description: {
    marginTop: 10,
    padding: "0 10px",
  },

  controls: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    bottom: -10,
    left: "25%",
  },
  operation: {
    border: "1px solid #5b5b5b",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    fontSize: "1rem",
    cursor: "pointer",
    color: "black",
  },

  amount: {
    padding: 5,
    color: "black",
  },

  price: {
    position: "relative",
    height: 90,
    marginBottom: 10,
    // paddingTop: 10,
  },

  total: {
    padding: 0,
    position: "absolute",
    bottom: -10,
    right: 10,
    "&>h6": {
      fontWeight: 700,
      fontSize: "0.7rem",
    },
  },

  productAavtar: {
    height: "100%",
    width: 70,

    "&>img": {
      objectFit: "contain",
    },
  },
  close: {
    zIndex: 100,
  },

  productPriceInDetails: {
    position: "absolute",
    bottom: 25,
    left: "25%",
    fontSize: "0.7rem",
    fontWeight: 700,
  },
}));
function ProductCard({
  id,
  name,
  image,
  media,
  description,
  price,
  category,
  count,
  isOpen = false,
}) {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  let [productTotal, setProductTotal] = useState(0);
  let [amount, setAmount] = useState();

  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);
  const location = useLocation();
  const { result } = stripHtml(description);
  const history = useHistory();

  const updateBasket = (operation) => {
    if (operation === "-" && amount > 0) {
      setAmount((previous) => previous - 1);
      setProductTotal((amount - 1) * price.raw);
      dispatch(removeformBasket(id));
      if (amount == 1) {
        history.push("/shop");
      }
    } else if (operation === "+") {
      setAmount((previous) => previous + 1);
      setProductTotal((amount + 1) * price.raw);
      dispatch(
        addtoBasket({
          id,
          name,
          description: result,
          image: media?.source,
          price,
          category,
          count,
        })
      );
    } else {
      setProductTotal(amount * price.raw);
    }
  };

  useEffect(() => {
    const getAmount = () => {
      const counter = basket.filter((item) => {
        return item.id == id;
      });
      setAmount(counter.length);
      // setProductTotal(amount * price.raw)
    };

    getAmount();
  }, [basket, location]);

  useEffect(() => {
    setChecked(isOpen);
    updateBasket();
  }, []);

  const paperClicked = () => {
    if (!checked) setChecked(true);
  };
  return (
    <Paper
      style={{ cursor: `${!checked ? "pointer" : "null"}` }}
      onClick={paperClicked}
      elevation={2}
      className={classes.root}
    >
      <img
        className={classes.productImage}
        src={image || media?.source}
        alt="product"
      />

      <div style={{ width: "100%", padding: 20 }}>
        <Typography className={classes.productPrice} variant="subtitle1">
          {price.formatted_with_symbol}
        </Typography>
        <Divider light />
        <div className={classes.productBody}>
          <Typography variant="subtitle2">{name.substring(0, 20)}</Typography>
          <div>
            {amount !== 0 && <RiUserHeartLine color="crimson" />}
            <BiDotsVerticalRounded
              onClick={() => setChecked((prev) => !prev)}
              className={classes.dots}
            />
          </div>
        </div>
      </div>
      <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
        <Paper elevation={0} className={classes.details}>
          <GiCrossMark onClick={() => setChecked((prev) => !prev)} />

          <div className={classes.price}>
            <Avatar
              className={classes.productAavtar}
              variant="square"
              src={image || media?.source}
            />
            <Typography
              variant="subtitle2"
              className={classes.productPriceInDetails}
            >
              ${price.raw}
            </Typography>
            <div className={classes.controls}>
              <Typography
                onClick={() => updateBasket("-")}
                className={classes.operation}
              >
                -
              </Typography>
              <Typography className={classes.amount}>{amount}</Typography>
              <Typography
                onClick={() => updateBasket("+")}
                className={classes.operation}
              >
                +
              </Typography>
            </div>

            <div className={classes.total}>
              <Typography variant="subtitle2">
                Total: {formatCurrency(amount * price.raw)}
              </Typography>
            </div>
          </div>

          <Divider light />
          <Typography className={classes.description} variant="subtitle2">
            {result}
          </Typography>
        </Paper>
      </Slide>
    </Paper>
  );
}

export default ProductCard;
