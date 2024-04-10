import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { TeacherContext } from "../../context/TeacherContext.jsx";

const Results = () => {

  const { user } = useContext(UserContext);
  const { results, getResults } = useContext(TeacherContext);

  useEffect(() => {
    getResults()
  }, []);

  return (
    <>
      {user && user.role!=1 && <Navigate replace to="/profile" />}
      <h1>Results</h1>
      {results?results.map((result,index)=>{
        return (
          <div key={'room_'+index} style={{borderWidth:2,padding:10}}>
            {index+1}. {result.name} {result.surname} | {result.email} | [{result.result}]
            <div>{result.description}</div>
          </div>
        )
      }):''}
    </>
  )
}

export default Results