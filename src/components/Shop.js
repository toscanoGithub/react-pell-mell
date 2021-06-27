import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  selectProducts,
  setProducts,
} from "../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1rem auto",

    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));
function Shop() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  useEffect(() => {
    const corsOptions = {
      credentials: true,
      allowHeaders: ["sessionId", "Content-Type"],
      exposeHeaders: ["sessionId"],
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      preflightContinue: false,
    };
    const getProducts = () => {
      fetch("https://fakestoreapi.com/products?limit=2")
        .then((res) => res.json())
        .then((data) => {
          dispatch(setProducts(data));
        });
    };

    
  }, []);
  console.log(products);
  return (
    <div className={classes.root}>
      {products.length > 0 &&
        products.map((product) => {
          return (
            <div key={product.id} className={classes.product}>
              <ProductCard {...product} />
            </div>
          );
        })}
    </div>
  );
}

export default Shop;
