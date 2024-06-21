import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, TextField } from '@mui/material';
import RatingStars from './RatingStars'; // Adjust the path as per your project structure
import axios from 'axios';
import backendUrl from './BackendUrl';
import DataContext from './context/DataContext';

const thumbnailStyle = {
  maxWidth: 50,
  height: 'auto',
};

const ProductTable = () => {
  const { token } = useContext(DataContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(`${backendUrl}/analytics/products`,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(productResponse?.data?.productsData || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleStockChange = (productId, newStock) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product._id === productId) {
        return { ...product, stock: newStock };
      }
      return product;
    }));
  };

  const handleStockInputChange = async (event, productId) => {
    const newStock = parseInt(event.target.value, 10);
    if (!isNaN(newStock)) {
      handleStockChange(productId, newStock);
    }
    try {
      console.log("new Stock", newStock);
      await axios.patch(`${backendUrl}/analytics/products/${productId}`, {
       newStock
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
   }
      )
    }
    catch (error)
    {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Brand</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <img src={product.thumbnail} alt={product.title} style={thumbnailStyle} />
              </TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{ Math.trunc(product?.price * 84 ).toLocaleString("en-IN",{
                style:"currency",
                currency:"INR"
              })}</TableCell>
              <TableCell>
                <RatingStars value={product.rating} />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={product.stock}
                  onChange={(event) => handleStockInputChange(event, product._id)}
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell>{product.brand}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
};

export default ProductTable;
