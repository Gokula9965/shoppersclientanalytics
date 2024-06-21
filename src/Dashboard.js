import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Container,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from 'axios';
import backendUrl from "./BackendUrl";
import Charts from "./Charts";
import DataContext from "./context/DataContext";

const Dashboard = () => {
  const { token } = useContext(DataContext);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [ordersDetails, setOrdersDetails] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchResponseOrders = await axios.get(`${backendUrl}/analytics/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrdersDetails(fetchResponseOrders?.data);
      }
      catch (error)
      {
        console.log(error);
      }
  }
    fetchOrders();
  }, []);
  const cardDetails = [
    {
      title: "Total Orders",
      value: ordersDetails?.ordersCount,
      icon: <ShoppingCartIcon />,
      color: "#3f51b5",
    },
    {
      title: "Inventory",
      value: ordersDetails?.inventoryCount,
      icon: <InventoryIcon />,
      color: "#4caf50",
    },
    {
      title: "Total Customers",
      value: ordersDetails?.customersCount,
      icon: <GroupIcon />,
      color: "#f44336",
    },
    {
      title: "Total Revenue",
      value: `${Math.trunc(ordersDetails?.totalRevenue).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      })}`,
      icon: <CurrencyRupeeIcon />,
      color: "#ff9800",
    },
  ];
  return (
    <>
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Grid container spacing={3}  sx={{marginLeft:isMobile?"40%":null}}>
          {cardDetails.map((detail, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  bgcolor: detail.color,
                  color: "white",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                          alignItems: "center",
                  width:isMobile?"300px":null,
                  minHeight: isMobile ? "auto" : "100px",
                  padding: isMobile ? 2 : 3,
                  textAlign: "center",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "white",
                      color: detail.color,
                      marginBottom: 1,
                    }}
                  >
                    {detail.icon}
                  </Avatar>
                  <Box>
                    <Typography variant={isMobile ? "body1" : "subtitle1"} component="div">
                      {detail.title}
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h5"} component="div">
                      {detail.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Box>
 
      
      </Container>
   
      <Container sx={{ marginTop: 4, marginLeft: isMobile ? "30%" : null }}>
        <Typography variant="h5" component='h2' gutterBottom fontWeight="bold">
          Order Revenue
      </Typography>
        <Charts />
      </Container> 
  
      </>
  );
};

export default Dashboard;




