import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";
import './css/students.css';
import './css/teachers.css';

const Students = () => {

  const [lang,nameAddColorCss] = useOutletContext();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState(null);
  const [newStudentID, setnewStudentID] = useState(null);

  console.log(1,user)
  
  if(user && user.role!=1){
    navigate('/profile')
  }

  if(newStudentID){
    navigate('/students/'+newStudentID)
  }  

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }

    getStudents()

  }, [user]);

  function getStudents(){
//    console.log(students)
    if(user==null) return

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
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['STUDENTS']}</h1>
      <div className='blockIn'>
        <Button style={{marginBottom:20}} type="primary" onClick={addStudent}>{languagePack[lang]['ADD_NEW_STUDENT']}</Button>
        {students?students.map((student,index)=>{
          return (
            <div key={'student_'+index} style={{borderColor:'RGB(0,122,174)',borderWidth:2, marginBottom:10}}>
              <Link to={'/students/' + student.id} className='student'>
                <div className={'color'+nameAddColorCss+" BlockCounter"}>
                  {index+1}
                </div>
                <div className={'color'+nameAddColorCss+" BlockTitle"}>
                  {languagePack[lang][student.title.toUpperCase()]}
                </div>
                <div className={'color'+nameAddColorCss+" BlockName"}>
                  {student.name} {student.surname}
                </div>
                <div className="BlockLogin">
                  <span>{languagePack[lang]['LOGIN']}:</span> {student.login}
                </div>
                <div className="BlockPassword">
                  <span>{languagePack[lang]['PASSWORD']}:</span> {student.password}
                </div>
              </Link>
            </div>
          )
        }):''}
      </div>
    </>
  )
}

export default Students