import React from 'react';
import { Rating } from '@mui/material';

const RatingStars = ({ value }) => {
  return (
    <Rating
      name="customized-icons"
      value={value}
      precision={0.5}
      readOnly
      icon={<span style={{ fontSize: '1.2em' }}>★</span>}
      emptyIcon={<span style={{ fontSize: '1.2em' }}>☆</span>}
    />
  );
};

export default RatingStars;
