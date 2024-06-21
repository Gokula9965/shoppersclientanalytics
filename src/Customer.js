    import React, { useContext, useEffect, useState } from "react";
    import Box from "@mui/material/Box";
    import Collapse from "@mui/material/Collapse";
    import IconButton from "@mui/material/IconButton";
    import Table from "@mui/material/Table";
    import TableBody from "@mui/material/TableBody";
    import TableCell from "@mui/material/TableCell";
    import TableContainer from "@mui/material/TableContainer";
    import TableHead from "@mui/material/TableHead";
    import TableRow from "@mui/material/TableRow";
    import Typography from "@mui/material/Typography";
    import Paper from "@mui/material/Paper";
    import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
    import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
    import TablePagination from "@mui/material/TablePagination";
    import TextField from "@mui/material/TextField";
    import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
    import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
    import axios from "axios";
    import backendUrl from "./BackendUrl";
    import { Button, useMediaQuery, Stack } from "@mui/material";
    import { FileDownload } from "@mui/icons-material";
import DataContext from "./context/DataContext";

    export default function CollapsibleTable() {
      const { token } = useContext(DataContext);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(5);
      const [openRow, setOpenRow] = useState(null);
      const [rows, setRows] = useState([]);
      const [fromDate, setFromDate] = useState(null);
      const [toDate, setToDate] = useState(null);
      const isMobile = useMediaQuery("(max-width: 600px)");

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

      const handleRowClick = (rowIndex) => {
        setOpenRow(openRow === rowIndex ? null : rowIndex);
      };

      useEffect(() => {
        const fetchCustomersData = async () => {
          try {
            const customerResponse = await axios.get(
              `${backendUrl}/analytics/customer?from=${fromDate}&to=${toDate}`,  {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setRows(customerResponse?.data?.customerDatas);
          } catch (error) {
            console.log(error);
          }
        };
        fetchCustomersData();
      }, [fromDate, toDate]);

      const filteredRows = rows.filter((row) => {
        if (!fromDate && !toDate) return true;
        const orderedAt = new Date(row.orderedAt);
        if (fromDate && orderedAt < new Date(fromDate)) return false;
        if (toDate && orderedAt > new Date(toDate)) return false;
        return true;
      });

      async function handleCSVDownload() {
        try {
          const response = await axios.get(
            `${backendUrl}/analytics/download-csv?from=${fromDate}&to=${toDate}`,
         
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const blob = new Blob([response?.data], { type: "text/csv" });

          // Create a link element, hide it, direct download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "report.csv";
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.log("Error downloading CSV:", error);
        }
      }

      return (
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{width:isMobile?"200px":null,marginLeft:isMobile?"32%":null, justifyContent: 'flex-end', mb: 2 }}>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                color="success"
                endIcon={<FileDownload />}
                onClick={handleCSVDownload}
                download
              >
                Csv
              </Button>
            </Stack>
          </LocalizationProvider>
          <TableContainer component={Paper} sx={{ marginLeft: isMobile ? "21%" : null }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>OrderId</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Address&nbsp;</TableCell>
                  <TableCell align="left">Email&nbsp;</TableCell>
                  <TableCell align="left">PhoneNumber&nbsp;</TableCell>
                  <TableCell align="left">Order Details&nbsp;</TableCell>
                  <TableCell align="left">Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <React.Fragment key={row?._id}>
                      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                        <TableCell>{row?.orderId}</TableCell>
                        <TableCell component="th" scope="row" align="left">
                          {row?.firstName + row?.lastName}
                        </TableCell>
                        <TableCell align="left">
                          {row?.address1 +
                            "," +
                            row?.city +
                            "-" +
                            row?.postalCode +
                            "," +
                            row?.state +
                            "," +
                            row?.country}
                        </TableCell>
                        <TableCell align="left">{row?.email}</TableCell>
                        <TableCell align="left">{row?.phoneNumber}</TableCell>
                        <TableCell align="left">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleRowClick(index)}
                          >
                            {openRow === index ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell align="left">
                          {Math.trunc(row?.totalAmount).toLocaleString("en-In", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={openRow === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Order Details
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>OrderedAt</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">
                                      Total price (Rs)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row?.customerItems?.map((order) => (
                                    <TableRow key={order?._id}>
                                      <TableCell component="th" scope="row">
                                        {new Date(
                                          row?.orderedAt
                                        ).toLocaleString("en-In")}
                                      </TableCell>
                                      <TableCell>{order?.title}</TableCell>
                                      <TableCell align="right">
                                        {order?.quantity}
                                      </TableCell>
                                      <TableCell align="right">
                                        {Math.trunc(
                                          order?.price * 84
                                        ).toLocaleString("en-In", {
                                          style: "currency",
                                          currency: "INR",
                                        })}
                                      </TableCell>
                                      <TableCell align="right">
                                        {Math.trunc(
                                          order?.price * order?.quantity * 84
                                        ).toLocaleString("en-In", {
                                          style: "currency",
                                          currency: "INR",
                                        })}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Box>
      );
    }
