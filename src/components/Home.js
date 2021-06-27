import React from "react";
import { Button, Divider, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 50px)",
  },
  homeHeader: {
    padding: 30,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    [theme.breakpoints.down("sm")]: {
      padding: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  },

  section1: {
    // width: "90%",
    // backgroundColor: "red",

    display: "grid",
    justifyContent: "flex-start",
    alignItems: "center",
    "&>h1": {
      fontSize: "4rem",
    },
    "&>h4": {
      fontSize: "1.3rem",
      letterSpacing: 2,
    },

    "&>a": {
      marginTop: 30,
      borderColor: "transparent",
      transition: "all 450ms ease",
      maxWidth: "100%",
      backgroundColor: "#6F7A94",
      color: "white",
      "&:hover": {
        borderColor: "#ccc",
        color: "black",
        backgroundColor: "white",
      },
    },

    [theme.breakpoints.down("sm")]: {
      maxWidth: "90%",
      margin: "1rem auto",
    },
  },

  section2: {
    border: "1px solid lightgrey",
    borderRadius: "50%",
    // flex: 1,
    width: "80vh",
    height: "80vh",
    // minHeight: 300,
    // backgroundColor: "green",
    background:
      "url('https://greatperformersacademy.com/images/images/Articles_images/Top-products-sell-online-2018.jpg') center center / cover no-repeat",

    [theme.breakpoints.down("sm")]: {
      //   backgroundPosition: "top",
      marginTop: 5,
      width: "85%",
      height: "85vw",
    },
  },
}));
function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.homeHeader}>
        <div className={classes.section1}>
          <Typography variant="h1">Pell-Mell,</Typography>

          <Typography variant="h4">
            Your one stop for a benefical online shopping
          </Typography>
          <Button component={Link} to="/shop" variant="outlined">
            See our products
          </Button>
        </div>
        <div className={classes.section2}></div>
      </div>
    </div>
  );
}

export default Home;

// colors 8593AE    5A4E4D    7E675E    DDA288

/*

import React from 'react'
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {

  }
}))
function Home() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            
        </div>
    )
}

export default Home

*/
