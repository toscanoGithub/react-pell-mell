import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  Typography,
  Backdrop,
  Fade,
} from "@material-ui/core";
import { selectBasket } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BiEditAlt, BiPrinter } from "react-icons/bi";
import ProductCard from "../components/ProductCard";
import { useDispatch } from "react-redux";
import Bill from "./Bill";
import { setPrinter } from "../features/printer/printerSlice";
import formatCurrency from "../helpers/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    // paddingLeft: 5,
    margin: "20px auto",
    backgroundColor: "#E7E7E7", //"#EDEBEB",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-around",
    overflowX:"hidden",

    "@media(max-width: 767px)": {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 0,
    },
  },

  order: {
    marginTop: 5,
    flex: 1,
    minWidth: 340,
  },

  cartEmpty: {
    "&>h6": {
      fontSize: "1.3rem",
      fontWeight: 700,
    },
  },

  section1: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "white",
    paddingLeft: 10,

    "&>img": {
      // marginTop: 30,
      alignSelf: "center",
      objectFit: "cover",
      maxWidth: 70,
      flex: 0.4,
    },

    "@media(max-width: 767px)": {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "&>img": {
        marginTop: 30,
      },
    },
  },

  section1Part1: {
    "&>.MuiTypography-body1": {
      color: "#000",
      marginTop: 5,
      fontWeight: 100,
    },
    // minWidth: "80%",
    position: "relative",
    flex: 1,
    padding: 10,
    "@media(max-width: 767px)": {
      padding: "30px 0px",
    },
  },

  section1Input: {
    minHeight: 100,
    // backgroundColor:"#ccc",
    position: "relative",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
    padding: 40,
    borderLeft: "1px solid #ccc",
    [theme.breakpoints.down("sm")]: {
      border: "none",
      padding: 10,
      alignSelf: "flex-end",
      marginBottom: 10,
    },
  },

  itemQty: {
    width: 30,
    height: 30,
    textAlign: "center",
    backgroundColor: "#6F7A94",
    display: "grid",
    placeItems: "center",
    color: "white",
    borderRadius: 5,
    marginRight: 5,
  },

  editBtn: {
    zIndex: 100,
    position: "absolute",
    right: 0,
    bottom: 0,
    "&>button": {
      // fontSize: "1.2rem",
    },
  },

  orderSummary: {
    alignSelf: "flex-start",
    height: "100vh",
    width: "100%",
    backgroundColor: "white",
    margin: "20px 10px 0 10px",

    "@media(max-width: 1092px)": {
      minWidth: 375,
    },

    // paddingLeft: 5,
    "@media(max-width: 767px)": {
      width: "100%",
      alignSelf: "center",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      // padding: "20px 15px 0 0",
    },
  },

  orderHeader: {
    marginTop: 20,
    marginLeft: 10,
    color: "#aaa",
    fontSize: "0.9rem",
    textTransform: "uppercase",
  },

  // modal
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toFade: {
    outline: "none",
  },

  orderHeaderWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  printer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#aaa",
    "&>h6": {
      marginRight: 10,
      fontSize: "0.8rem",
      color: "#000",
      paddingLeft: "3px",
    },
    "&:hover": {
      cursor: "pointer",
      opacity: 0.8,
    },
  },
}));
function Cart() {
  const classes = useStyles();
  const basket = useSelector(selectBasket);
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();
  // modal stuff
  const [open, setOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const handleOpen = (item) => {
    setItemToEdit(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let countMap = basket.reduce((map, value) => {
      map.set(value.id, (map.get(value.id) || 0) + 1);
      return map;
    }, new Map());

    let items = [...countMap];

    const convertedItems = items.map((item) => ({
      id: item[0],
      count: item[1],
    }));
    const ids = convertedItems.map((c) => c.id);
    let b = ids.map((id) => {
      return basket.filter((f) => f.id === id);
    });

    console.log("b>>>", b);

    let newBasket = b.map((g) => ({ order: g[0], qty: g.length }));
    console.log("Orders >>>>", newBasket);
    setOrders(newBasket);
  }, [basket.length]);

  const print = () => {
    dispatch(setPrinter(true));
    history.push("/print");
  };

  return (
    <div className={classes.root}>
      {basket.length === 0 ? (
        <div className={classes.cartEmpty}>
          <Typography variant="subtitle1">Your cart is empty</Typography>
          <Button onClick={() => history.push("/shop")} variant="outlined">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className={classes.orders}>
          <div className={classes.orderHeaderWrapper}>
            <Typography className={classes.orderHeader}>
              Your selections
            </Typography>
            <div className={classes.printer} onClick={print}>
              <BiPrinter /> <Typography variant="subtitle1">Print</Typography>
            </div>
          </div>

          {[...orders].map((item) => (
            <div key={item.order.id} className={classes.order}>
              <Divider light />
              <div className={classes.section1}>
                <IconButton
                  onClick={() => handleOpen(item)}
                  className={classes.editBtn}
                >
                  <BiEditAlt color="#5b5b5b" />
                </IconButton>
                <img
                  style={{ width: 100, objectFit: "cover" }}
                  src={item.order.image}
                  alt="order pic"
                />
                <div className={classes.section1Part1}>
                  <Typography variant="body1">{item.order.title}</Typography>
                  <Typography style={{ color: "#1D2136" }} variant="subtitle2">
                    {item.order.description}
                  </Typography>
                  <Typography variant="body1">AVAILABLE</Typography>
                  <Typography style={{ color: "#1D2136" }} variant="subtitle2">
                    Your selection is available for immediate purchase online.
                    You will be notified when your item is shipped.
                  </Typography>
                </div>

                <div className={classes.section1Input}>
                  <Divider orientation="vertical" light />
                  <div className={classes.itemQty}>{item.qty}</div>
                  <Typography>
                    {formatCurrency(item.qty * item.order.price.raw)}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {basket.length > 0 && (
        <Paper elevation={0} className={classes.orderSummary}>
          <Bill />
        </Paper>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.toFade}>
            <ProductCard isOpen={true} {...itemToEdit?.order} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Cart;
