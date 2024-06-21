import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import backendUrl from "./BackendUrl";
import './Charts.css';  // Import the CSS file for custom styling
import DataContext from "./context/DataContext";

export default function Charts() {
  const { token } = useContext(DataContext);
  const [prices, setPrices] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formatTick = (value) => {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const fetchChartsData = async () => {
    try {
      const start = startDate.toISOString().split('T')[0]
      const end = endDate.toISOString().split('T')[0];
      console.log(start);
      console.log(end);
      const priceResponse = await axios.get(`${backendUrl}/analytics/categorySums?from=${start}&to=${end}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(priceResponse?.data);
      setPrices(priceResponse?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, [startDate,endDate]);

  const data = [
    { category: 'mens', price: prices?.mens },
    { category: 'womens', price: prices?.womens },
    { category: 'beauty', price: prices?.beauty },
    { category: 'smart', price: prices?.smart },
    { category: 'sports', price: prices?.sports },
    { category: 'groceries', price: prices?.groceries },
    { category: 'decorify', price: prices?.decorify },
    { category: 'homeAppliances', price: prices?.homeAppliances },
  ];

  return (
    <div>
      <div className="date-picker-container">
        <div className="date-picker">
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="date-picker">
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <XAxis
            dataKey="category"
            label={{
              value: 'Category',
              position: 'insideBottom',
              offset: -5,
              dy: 5,
            }}
            interval={0}
            style={{ fontSize: '12px' }} // Adjust font size for mobile
          />
          <YAxis
            tickFormatter={formatTick}
            label={{
              value: 'Price',
              angle: -90,
              position: 'insideLeft',
              dx: -15,
            }}
            style={{ fontSize: '12px' }} // Adjust font size for mobile
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="price" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
