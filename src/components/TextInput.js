import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useField, ErrorMessage } from "formik";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  input: {
    border: "1px solid transparent",
    transition: "all 700ms ease",
    padding: "0.8rem 0.5rem",
    width: "100%",
    outline: "none",
    borderRadius: 5,
    backgroundColor: "#F5F5F5",
  },
  isInvalid: {
    border: "1px solid #F9353F",
  },

  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    lineHeight: 2,
  },
}));

export default function TextInput({ label, ...props }) {
  const classes = useStyles();
  const [field, meta] = useField(props);

  const classErrors = `${classes.input} ${classes.isInvalid}`;
  return (
    <div className={classes.root}>
      <label
        className={classes.label}
        style={{ marginTop: 15 }}
        htmlFor={field.name}
      >
        {label}
      </label>
      <input
        className={`${
          meta.touched && meta.error ? classErrors : classes.input
        }`}
        {...field}
        {...props}
        autoComplete="off"
      />
      <ErrorMessage
        component={Typography}
        style={{ color: "#F9353F", fontSize: "0.9rem" }}
        name={field.name}
      />
    </div>
  );
}
