import Mail from "@mui/icons-material/Mail";
import Person from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Snackbar,
  Backdrop,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Input,
  CircularProgress,
  InputLabel,
  Modal,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Assets/Styles/HomeStyles.css";
import Footer from "../Components/Footer";
import UserList from "../Components/UserList";
import { userAccessDispatchers } from "../Redux/Reducers/userSlice";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [snackBarSuccessText, setSnackBarSuccessText] = useState("");
  const [snackBarErrorText, setSnackBarErrorText] = useState("");
  const [loader, setLoader] = useState(false);

  const userObj = useSelector((state) => state.user);
  const [values, setValues] = React.useState({
    fullName: "",
    password: "",
    email: "",
    showPassword: false,
  });
  const [loginFlag, setLoginFlag] = useState(false);
  const [page, setPage] = React.useState(1);
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (userObj.authorised === true) {
      navigate("/game");
    } else {
      navigate("/");
    }
    if (userObj.loading === true) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [userObj]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setValues({
      fullName: "",
      email: "",
      password: "",
    });
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const style = {
    position: "relative",
    display: "grid",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "3px solid white",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      userAccessDispatchers.getUsers({
        success: (response) => {
          console.log(response);
          setUserData(response.data);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }, []);
  useEffect(() => {
    if (
      userObj.user !== null &&
      userObj.error === "" &&
      userObj.loading === false
    ) {
    } else if (userObj.error !== "" && userObj.loading === false) {
      const msg = loginFlag ? "Cannot login -" : "Cannot sign up -";
      setSnackBarErrorText(msg + userObj.error);
    }
  }, [userObj]);
  const list = [...userData];
  const data = list?.sort(function (a, b) {
    return b.score - a.score;
  });
  const dataPerPage = 1;
  const indexOfLastPost = page * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  const total = Math.ceil(data.length / dataPerPage);
  const handleStart = () => {
    setLoginFlag(false);
    handleOpen();
  };
  const handleLogin = () => {
    setLoginFlag(true);
    handleOpen();
  };
  const handleSignUpLogin = (e) => {
    e.preventDefault();

    if (loginFlag) {
      let data = {
        email: values.email,
        password: values.password,
      };
      dispatch(
        userAccessDispatchers.signIn(data, {
          success: (response) => {
            console.log("response login", response);
            const { user, token } = response.data;
            localStorage.setItem("token", token);
            console.log(user);
            if (user) {
              navigate("/game");
            }
          },
        })
      );
    } else {
      let data = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        level: 0,
        score: 0,
      };
      dispatch(
        userAccessDispatchers.signUp(data, {
          success: (response) => {
            console.log("response signup", response);
            if (response.data.user) {
              setSnackBarSuccessText("User created successfully");

              handleClose();
            }
          },
        })
      );
    }
  };
  return (
    <div className="Home">
      <a className="Login" onClick={() => handleLogin()}>
        Login
      </a>
      <div>
        <h2 className="Heading">Word Race</h2>
        <p className="headPara">
          Welcome to <b>Word Race</b> where you can enhance you typing skills
          with some fun.
        </p>
      </div>
      <button className="start-btn" onClick={() => handleStart()}>
        Get Started
      </button>
      <div>
        <h3 className="leader">Our Top Leaders</h3>
        <div className="user-table">
          <UserList data={currentPosts} />
          <Stack
            sx={{ display: "center", justifyContent: "center", margin: "10px" }}
            spacing={2}
          >
            <Pagination count={total} page={page} onChange={handleChangePage} />
          </Stack>
        </div>
      </div>
      <Footer />
      <Snackbar
        style={{ display: "flex", justifyContent: "center" }}
        className="snackbar"
        open={Boolean(snackBarErrorText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarErrorText("")}
      >
        <Alert severity="error">{snackBarErrorText}</Alert>
      </Snackbar>

      <Snackbar
        style={{ display: "flex", justifyContent: "center" }}
        className="snackbar"
        open={Boolean(snackBarSuccessText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarSuccessText("")}
      >
        <Alert severity="success">{snackBarSuccessText}</Alert>
      </Snackbar>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          {!loginFlag ? (
            <FormControl sx={{ m: 1, width: "45ch" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                FULL NAME
              </InputLabel>
              <Input
                required
                id="standard-adornment-password"
                type="text"
                value={values.fullName}
                onChange={handleChange("fullName")}
                endAdornment={
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                }
              />
            </FormControl>
          ) : null}
          <FormControl sx={{ m: 1, width: "45ch" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">EMAIL</InputLabel>
            <Input
              required
              id="standard-adornment-password"
              type="text"
              value={values.email}
              onChange={handleChange("email")}
              endAdornment={
                <InputAdornment position="end">
                  <Mail />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "45ch" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              PASSWORD
            </InputLabel>
            <Input
              id="standard-adornment-password"
              required
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "" }}
              onClick={handleClose}
            >
              Close
            </Button>
            {loader ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
                onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : null}
            <Button
              variant="contained"
              style={{ backgroundColor: "" }}
              onClick={(e) => handleSignUpLogin(e)}
            >
              {loginFlag ? "Login" : "SignUp"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
