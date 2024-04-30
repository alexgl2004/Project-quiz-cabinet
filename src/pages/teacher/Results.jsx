import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import StudentResults from "../../components/StudentResults.jsx";
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";

const Results = () => {

  const [lang] = useOutletContext();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [studentsMass, setStudents] = useState(null);

  if(user!=null && user.role==2){
    navigate('/profile')
  }

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }

    getStudents()

  }, [user]);

  function getStudents(){

    if(user==null || user.role==3) return
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
      <h1>{languagePack[lang]['RESULTS']}</h1>
      {user!=null && user.role==3?
        <StudentResults oneUser={true} userId={user.id} />:''
      }
      
      {user!=null && user.role==1 && studentsMass?
        studentsMass.map((elem)=>{
          return <StudentResults key={elem.id+'_student'} oneUser={false} userId={elem.id} firstname={elem.name}  lastname={elem.surname} />
        }):''

      }
      
    </>
  )
  
}

export default Results