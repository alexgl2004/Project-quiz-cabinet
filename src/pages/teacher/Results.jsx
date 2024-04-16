import React, { useState, useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";

const Results = () => {

  const { user } = useContext(UserContext);
  const [results, setResults] = useState(null);

  function getResults(){
    //    console.log(students)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        };        
    
    //    useEffect(() => {
    
    
          fetch('http://localhost:3000/users/results', requestOptions)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
  //          console.log(data)
            if(data.resultsData){
              setResults(
                data.resultsData
              )
            }else{
    //            console.log(data.msg)
            }
    
    //          console.log(data);
    
          });
    //    }, [user]);
    
    }  


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