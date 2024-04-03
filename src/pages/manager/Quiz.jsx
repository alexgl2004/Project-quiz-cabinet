import React, { useContext } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";

const Quiz = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.role==1 && <Navigate replace to="/profile" />}
      <h1>Quiz</h1>
    </>
  )
}

export default Quiz