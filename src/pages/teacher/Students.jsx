import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';

const Students = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  if(user && user.role!=1){
    navigate('/profile')
  }

  const [students, setStudents] = useState(null);
  const [newStudentID, setnewStudentID] = useState(null);

  useEffect(() => {
    getStudents()
  }, []);

  function getStudents(){
//    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {


      fetch(path_server+'/users/students', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
//        console.log(data)
        if(data.studentsData){
          setStudents(
            data.studentsData
          )
//          setMsg(data.msg)
        }else{
//          console.log(data.msg)
//          setMsg(data.msg)
        }

//          console.log(data);

      });
//    }, [user]);

  }

  function addStudent(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
      mode:'cors'
    };

    fetch(path_server+'/users/students/add', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data)
      if(data.user_id){
        setnewStudentID(data.user_id)
      }else{
//       console.log(data.msg)
//       setMsg(data.msg)
      }
//    console.log(data);
    });
  }

//  console.log(2,students)

  return (
    <>
      {newStudentID?<><Navigate replace to={"/students/"+newStudentID} /></>:''}
      <h1>{languagePack[lang]['STUDENTS']}</h1>
      {students?students.map((student,index)=>{
        return (
          <div key={'student_'+index}style={{borderWidth:2,padding:10}}>
            {index+1}. <Link to={'/students/' + student.id}>{student.title}, {student.name}, {student.surname}, {student.email}</Link>
          </div>
        )
      }):''}
      <Button onClick={addStudent}>{languagePack[lang]['ADD_NEW_STUDENT']}</Button>
    </>
  )
}

export default Students