import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { TeacherContext } from "../../context/TeacherContext.jsx";

const Students = () => {

  const { user } = useContext(UserContext);
  const { students, getStudents } = useContext(TeacherContext);

  useEffect(() => {
    getStudents()
  }, []);

//  console.log(2,students)

  return (
    <>
      {user && user.role!=1 && <Navigate replace to="/profile" />}
      <h1>Students</h1>
      {students?students.map((student,index)=>{
        return (
          <div key={'student_'+index}style={{borderWidth:2,padding:10}}>
            {index+1}. {student.title}, {student.name}, {student.surname}, {student.email}
          </div>
        )
      }):''}
    </>
  )
}

export default Students