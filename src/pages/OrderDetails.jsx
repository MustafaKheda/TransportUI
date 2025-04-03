import React from 'react'
import OrdersTable from '../components/OrderDetailsPage/OrdersTable'
function OrderDetails() {
  return (
    <div className='flex w-full p-4 flex-col gap-2 justify-center items-center'>
      <h1 className='text-2xl font-semibold'>Order Details</h1>
      <OrdersTable/>
    </div>
  )
}

export default OrderDetails