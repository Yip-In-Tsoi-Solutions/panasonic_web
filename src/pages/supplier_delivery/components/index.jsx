import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
function Supplier_delivery() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div className='mt-[10px] m-auto flex'>
      Supplier Delivery
    </div>
  );
}

export default Supplier_delivery;
