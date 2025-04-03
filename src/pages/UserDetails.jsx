import React from 'react'
import UsersTable from '../components/UsersDetailsPage/UsersTable'
function UserDetails() {
  return (
    <div className='flex flex-col justify-center items-center p-4 gap-2'>
      <h1 className='text-2xl font-semibold'>Users Details</h1>
      <UsersTable/>
    </div>
  )
}

export default UserDetails