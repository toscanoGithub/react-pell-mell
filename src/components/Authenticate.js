import { Button, Paper, Switch } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import TextInput from "./TextInput";
import firebase from "firebase";
import { db, auth, provider } from "../firebase";
import { useHistory } from "react-router-dom";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    margin: "1rem auto",
    backgroundColor: "#FFFEFF",
  },
  header: {
    "&.MuiTypography-body1": {
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: 700,
      // width: 50,
      padding: 10,
      margin: "0 auto",
      letterSpacing: 1,
    },
  },

  form: {
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: "0 auto",
    padding: "0px 20px 10px 20px",
    borderRadius: 12,
  },

  formControl: {
    width: "100%",
  },

  submitBtn: {
    marginTop: 15,
    backgroundColor: "#6F7A94",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#6F7A94",
      color: "white",
      opacity: 0.9,
      fontWeight: "bold",
    },
  },

  authMode: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",

    "&>h6": {
      fontSize: "0.8rem",
    },
  },
}));
const Authenticate = () => {
  const [isCustom, setIsCustom] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();

  const classes = useStyles();
  const [alreadyRegistered, setAlreadyRegistered] = useState({
    checked: false,
  });

  const signInWithGoogle = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(
          "user >>>",
          result.user.email,
          result.user.displayName,
          result.user.uid
        );

        dispatch(
          setUser({
            displayName: result.user.displayName,
            email: result.user.email,
            id: result.user.uid,
            profilePic: result.user.photoURL,
          })
        );

        history.push("/checkout");
      })
      .catch((error) => console.log(error.message));
  };
  const handleSwitch = (e) => {
    setAlreadyRegistered({
      ...alreadyRegistered,
      [e.target.name]: e.target.checked,
    });
  };
  const validate = Yup.object({
    displayName: Yup.string().max(15, "Must be 15 characters or less"),
    // .required("required"),
    email: Yup.string().email("Email is invalid").required("required"),

    password: Yup.string()
      .min(6, "Password should be at least 6 characters")
      .required("required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match!")
      .required("required"),
  });
  return (
    <Paper elevation={10} className={classes.root}>
      <Typography className={classes.header}>
        {alreadyRegistered.checked ? "Login" : "Register"}
      </Typography>

      <Divider light />
      <Formik
        initialValues={{
          displayName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          if (!alreadyRegistered.checked) {
            auth
              .createUserWithEmailAndPassword(values.email, values.password)
              .then((response) => {
                firebase.database().ref("users").child(response.user.uid).set({
                  displayName: values.displayName,
                  email: values.email,
                });

                db.collection("users")
                  .doc(response.user.email)
                  .set({
                    email: values.email,
                    displayName: values.displayName,
                  })
                  .then(() => {
                    dispatch(
                      setUser({
                        displayName: values.displayName,
                        email: values.email,
                        id: response.user.uid,
                        profilePic: response.user?.photoURL,
                      })
                    );
                    history.push("/checkout");
                  });
              })
              .catch((error) =>
                console.log("Failed to register", error.message)
              );
          } else {
            auth
              .signInWithEmailAndPassword(values.email, values.password)
              .then((response) => {
                console.log("response from signin", response);
                

                db.collection("users")
                  .doc(response.user.email)
                  .onSnapshot((doc) => {
                    console.log("User logged in", doc.data());
                    dispatch(
                      setUser({
                        displayName: doc.data().displayName,
                        email: doc.data().email,
                        id: response.user.uid,
                        profilePic: response.user?.photoURL,
                      })
                    );

                    history.push("/checkout");
                  });
              })
              .catch((error) => console.log("Failed to login", error.message));
          }
        }}
      >
        {(formik) => (
          <Form className={classes.form}>
            {!alreadyRegistered.checked && (
              <div className={classes.formControl}>
                <TextInput label="Username" name="displayName" type="text" />
              </div>
            )}

            <div className={classes.formControl}>
              <TextInput label="Email" name="email" type="email" />
            </div>

            <div className={classes.formControl}>
              <TextInput label="Password" name="password" type="password" />
            </div>
            <div className={classes.formControl}>
              <TextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
            </div>
            <Button
              className={classes.submitBtn}
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
            >
              {alreadyRegistered.checked ? "Login" : "Register"}
            </Button>
            <div className={classes.authMode}>
              <Switch
                checked={alreadyRegistered.checked}
                onChange={handleSwitch}
                name="checked"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />{" "}
              <Typography variant="subtitle2">
                Already have an account
              </Typography>
            </div>

            <Button
              onClick={signInWithGoogle}
              className={classes.submitBtn}
              color="primary"
              fullWidth
              variant="contained"
            >
              Signin with Google
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Authenticate;

/*
setUser({
            displayName: result.user.displayName,
            email: result.user.email,
            id: result.user.uid,
            profilePic: result.user.photoURL,
          })
          */
