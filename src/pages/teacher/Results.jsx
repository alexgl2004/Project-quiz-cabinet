import React, { useState, useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import StudentResults from "../../components/StudentResults.jsx";
import QRCode from "react-qr-code";
import { Button, Modal, Space } from 'antd';

const Results = () => {

  const { user } = useContext(UserContext);
  const [studentsMass, setStudents] = useState(null);

  useEffect(() => {
    getStudents()
  }, []);

  function getStudents(){

    if(user==null || user.role==3) return
  //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


      fetch('http://192.168.2.134:3000/users/students', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if(data.studentsData){
          setStudents(
            data.studentsData
          )
        }else{
//          console.log(data.msg)
        }

      });
  
    }

  return (
    <>
      {user!=null && user.role==2 && <Navigate replace to="/profile" />}
      <h1>Results</h1>
      {user!=null && user.role==3?
        <StudentResults oneUser={true} userId={user.id} />:''
      }
      
      {user!=null && user.role==1 && studentsMass?
        studentsMass.map((elem)=>{
          return <StudentResults oneUser={false} userId={elem.id} firstname={elem.name}  lastname={elem.surname} />
        }):''

      }
      
    </>
  )
  
}

export default Results