import React, { useContext } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";

const Statistic = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.role==1 && <Navigate replace to="/profile" />}
      <h1>Statistic</h1>
    </>
  )
}

export default Statistic