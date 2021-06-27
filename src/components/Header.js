import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import "../index";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { HiShoppingCart } from "react-icons/hi";
import { Link, useHistory } from "react-router-dom";
import {
  logoutUser,
  selectBasket,
  selectUser,
  setUser,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "fixed",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    zIndex: 300,
    // width: "100%",
  },
  logo: {
    objectFit: "cover",
    cursor: "pointer",
  },
  cartLogin: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "&>a": {
      marginLeft: 10,
      cursor: "pointer",
    },
  },

  cartIcon: {
    width: 25,
    height: 25,
    marginTop: 8,
    color: "white",
  },
  badge: {
    marginRight: 10,
    marginTop: 0,
    "&>.MuiBadge-badge": {
      backgroundColor: "white",
      color: "crimson",
      marginTop: 2,
    },
  },

  cartWrapper: {
    position: "fixed",
    right: 20,
    top: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "#6F7A94",
    padding: 8,
    borderRadius: 5,
  },
  avatar: {
    width: 25,
    height: 25,
    marginTop: 6,
  },

  greetings: {
    padding: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&>button": {
      backgroundColor: "#61AF61",
      color: "white",
      padding: 2,
      fontSize: "0.7rem",
      textTransform: "capitalize",
      cursor: "pointer",
      transition: "all 700ms ease",
      "&:hover": {
        backgroundColor: "#61AF61",
        color: "white",
        opacity: 0.8,
      },
    },
  },
}));
function Header() {
  const classes = useStyles();
  const basket = useSelector(selectBasket);
  const dispatch = useDispatch();
  const [accumulator, setAccumulator] = useState(0);
  const history = useHistory();
  const user = useSelector(selectUser);

  useEffect(() => {
    const getBasketItemscount = () => {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const counts = basket.map((item) => item.count);
      if (counts.length > 0) setAccumulator(counts?.reduce(reducer) || 0);
    };
    getBasketItemscount();
  }, [dispatch, basket]);

  const logout = () => {
    auth
      .signOut()
      .then((response) => {
        dispatch(setUser(null));
        history.replace("/");
      })
      .catch((error) => console.log(error.message));
  };
  return (
    <>
      <div className={classes.root}>
        <img
          onClick={() => history.push("/")}
          className={classes.logo}
          width="100px"
          src={logo}
          alt="logo"
        />

        <div className={classes.cartWrapper}>
          <Link to="/cart">
            <Badge
              className={classes.badge}
              badgeContent={basket.length}
              color="primary"
            >
              <HiShoppingCart
                style={{ marginLeft: `${basket.length === 0 ? 8 : 0}` }}
                className={classes.cartIcon}
              />
            </Badge>
          </Link>
        </div>
      </div>
      <Divider light />
      {user && (
        <div className={classes.greetings}>
          <Typography className={classes.logout} variant="subtitle2">
            Hello, {user.displayName}
          </Typography>
          <Button onClick={logout} variant="contained">
            Logout
          </Button>
        </div>
      )}
    </>
  );
}

export default Header;
