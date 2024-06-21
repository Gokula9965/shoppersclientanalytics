import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../BackendUrl";

const DataContext = createContext({});
export const DataProvider = ({ children }) => {
  const navigate = useNavigate("");
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [emailIdError, setEmailIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [authName, setAuthName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [token, setToken] = useState("");

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLogout(e) {
    e.preventDefault();
    setAuthName("");
    setToken("");
    localStorage.clear();
    handleMenuClose();
    navigate("/login");
  }

  function handleToggleVisibility() {
    setShowPassword(!showPassword);
  }

  function handleConfirmVisibility() {
    setShowConfirmPassword(!showConfirmPassword);
  }
  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setUserNameError(false);
    setEmailIdError(false);
    setPasswordError(false);

    if (userName === "") {
      setUserNameError(true);
    }
    if (emailId === "") {
      setEmailIdError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }

    if (containsOnlyNumbers(userName)) {
      setUserNameError(true);
      setAlertMessage("Username shouldn't contain numbers");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    if (userName && password && emailId && !containsOnlyNumbers(userName)) {
      try {
        const response = await axios.post(`${backendUrl}/user/register`, {
          userName,
          emailId,
          password,
        });
        if (response.status === 200) {
          setAlertMessage("User registered successfully");
          setAlertSeverity("success");
          setShowAlert(true);
          setUserName("");
          setEmailId("");
          setPassword("");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setAlertMessage("Registration failed. Please try again.");
          setAlertSeverity("error");
          setShowAlert(true);
        }
      } catch (error) {
        console.log(error);
        setAlertMessage(`${error?.response?.data?.message}`);
        setAlertSeverity("error");
        setShowAlert(true);
      }
    }
  }
  async function handleLogin(e) {
    e.preventDefault();
    setEmailIdError(false);
    setPasswordError(false);
    if (emailId === "") {
      setEmailIdError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }
    if (emailId && password) {
      try {
        const response = await axios.post(`${backendUrl}/user/login`, {
          emailId,
          password,
        });
        if (response.status === 200) {
          const accessToken = response?.data?.accessToken;
          setToken(accessToken);
          try {
            const currentUser = await axios.get(
              `${backendUrl}/user/currentUser`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setAuthName(currentUser?.data?.user?.userName);
            const currentData = currentUser?.data;
            currentData.accessToken = accessToken;
            localStorage.setItem("currentUsers", JSON.stringify(currentData));
          } catch (error) {
            setAlertMessage(`${error?.response?.data?.message}`);
            setAlertSeverity("error");
            setShowAlert(true);
          }
          setAlertMessage("Successfully logged In");
          setAlertSeverity("success");
          setShowAlert(true);
          setEmailId("");
          setPassword("");
          navigate("/");
        } else {
          setAlertMessage("Login Failed. Please try again.");
          setAlertSeverity("error");
          setShowAlert(true);
        }
      } catch (error) {
        setEmailId("");
        setPassword("");
        setAlertMessage(`${error.response.data.message}`);
        setAlertSeverity("error");
        setShowAlert(true);
      }
    }
  }
  useEffect(() => {
    const fetchStorage = async () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUsers"));
      let currentDate = new Date();
      let currentTimestamp = Math.floor(currentDate.getTime() / 1000);
      if (storedUser?.exp && currentTimestamp < storedUser?.exp) {
        try {
          setAuthName(storedUser?.user?.userName);
          setToken(storedUser?.accessToken);
        } catch (error) {
          console.log(error);
        }
      } else {
        navigate("/login");
      }
    };
    (async () => await fetchStorage())();
  }, []);
  return (
    <DataContext.Provider
      value={{
        showPassword,
        setShowPassword,
        userName,
        setUserName,
        emailId,
        setEmailId,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        userNameError,
        setUserNameError,
        emailIdError,
        setEmailIdError,
        passwordError,
        setPasswordError,
        confirmPasswordError,
        setConfirmPasswordError,
        alertMessage,
        setAlertMessage,
        alertSeverity,
        setAlertSeverity,
        showAlert,
        setShowAlert,
        handleToggleVisibility,
        handleConfirmVisibility,
        handleRegister,
        handleLogin,
        authName,
        setAuthName,
        token,
        anchorEl,
        setAnchorEl,
        handleMenuOpen,
        handleLogout,
        handleMenuClose
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataContext;
