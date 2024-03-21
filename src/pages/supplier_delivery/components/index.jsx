import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../actions/counterSlice';

function Supplier_delivery() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div className='mt-[10px] m-auto flex'>
      <h1>{count.value > 0 ? count.value : 0}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default Supplier_delivery;
