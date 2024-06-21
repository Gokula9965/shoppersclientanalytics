import {
  AddCircleOutlineOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DataContext from "../context/DataContext";

const Register = () => {
  const {
    showPassword,
    userName,
    setUserName,
    emailId,
    setEmailId,
    password,
    setPassword,
    userNameError,
    emailIdError,
    passwordError,
    alertMessage,
    alertSeverity,
    showAlert,
    setShowAlert,
    handleToggleVisibility,
    handleRegister,
  } = useContext(DataContext);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "85vh" }}>
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
          width: isXs ? 280 : isSm ? 320 : isMd ? 400 : isLg ? 450 : isXl ? 500 : 450,
          margin: "20px auto",
        }}
      >
        <Grid align="center">
          <Avatar sx={{ backgroundColor: "#1bbd7e" }}>
            <AddCircleOutlineOutlined />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
        </Grid>
        <TextField
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          label="Username"
          placeholder="Enter Username"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          error={userNameError}
        />
        <TextField
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          label="Email Id"
          placeholder="Enter Email Id"
          fullWidth
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          required
          error={emailIdError}
        />
        <TextField
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          label="Password"
          placeholder="Enter Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={passwordError}
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
          onClick={handleRegister}
        >
          Sign up
        </Button>
        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Register;
