import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Shop from "./components/Shop";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Header from "./components/Header";
import Print from "./components/Print";
import Checkout from "./components/Checkout";
import Authenticate from "./components/Authenticate";
import { commerce } from "./lib/commerce"
import { useDispatch } from "react-redux";
import { setProducts } from "./features/products/productsSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#F6F8FA",
  },
}));
function App() {
  const classes = useStyles();
  const promise = loadStripe(
    "pk_test_51HQBlEEdxauSUfDOfEQxnxhjpRbVKtRPenDBqVFxk8wx0iAPgKFcJQUb03TvIdqpXRbmCxqrA1mKiwhfHFQ1632C00Aen3y6GM"
  );

  // const [products, setProducts] = useState([])
  const dispatch = useDispatch()
  

/*
  id,
  title,
  image,
  description,
  price,
  category,
  count,
  */

  const fetchProducts = () => {
    commerce.products
      .list()
      .then((response) => {
        // setProducts(response.data)
        dispatch(setProducts(response.data));
      })
      .catch((error) => {
        console.log("There was an error fetching the products", error);
      });
  };
  useEffect(() => {
    fetchProducts()
    
  }, [])
  // console.log(products);
  return (
    <div className={classes.root}>
      <Router>
        <Header />
        <Switch>
          <Route path="/checkout">
            <Elements stripe={promise}>
              <Checkout />
            </Elements>
          </Route>
          <Route path="/authenticate" component={Authenticate} />
          <Route path="/print" component={Print} />
          <Route path="/shop" component={Shop} />
          <Route exact path="/cart" component={Cart} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
