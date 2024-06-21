import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DataContext from "../context/DataContext";

const Login = () => {
  const {
    emailId,
    setEmailId,
    password,
    setPassword,
    showPassword,
    emailIdError,
    passwordError,
    alertMessage,
    alertSeverity,
    showAlert,
    setShowAlert,
    handleToggleVisibility,
    handleLogin,
  } = useContext(DataContext);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "85vh" }}
    >
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Paper
        elevation={10}
        sx={{
          padding: isXs ? 2 : isSm ? 3 : isMd ? 4 : isLg ? 5 : 6,
          width: isXs
            ? 280
            : isSm
            ? 320
            : isMd
            ? 400
            : isLg
            ? 450
            : isXl
            ? 500
            : 450,
          margin: "20px auto",
        }}
      >
        <Grid align="center">
          <Avatar style={{ backgroundColor: "#1bbd7e" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
        </Grid>
        <TextField
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          label="Email Id"
          placeholder="Enter Email Id"
          fullWidth
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          error={emailIdError}
          required
        />
        <TextField
          sx={{ mt: 2, mb: 2 }}
          label="Password"
          placeholder="Enter Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          sx={{ mt: 2, mb: 2 }}
          type="submit"
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleLogin}
        >
          Sign in
        </Button>
        <Typography sx={{ mt: 2, mb: 2 }}>
          <Link to="/reset-password" style={{ textDecoration: "none" }}>
            Forget Password ?
          </Link>
          <Typography sx={{ mt: 2, mb: 2 }}>
            Don't you have account ?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Sign Up
            </Link>
          </Typography>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
