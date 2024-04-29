import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';

const Quizes = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [quizes, setQuizes] = useState(null);
  const [newQuizID, setnewQuizID] = useState(null);


  if(user && user.role!=2){
    navigate('/profile')
  }

  if(newQuizID){
    navigate("/quiz/"+newQuizID)
  }    

//  const { rooms, getRooms } = useContext(TeacherContext);

  useEffect(() => {
    getQuizes()
  }, []);

  function addQuiz(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'New Quiz',
        description: 'Description for Quiz',
        params:'',
        creator_id: user.id
      }),
      mode:'cors'
    };

    fetch(path_server+'/quiz/add', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      if(data.quiz_id){
        setnewQuizID(data.quiz_id)
      }else{
//       console.log(data.msg)
//       setMsg(data.msg)
      }
//    console.log(data);
    });
  }

  function getQuizes(){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {


    fetch(path_server+'/quiz', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//          console.log(data)
      if(data.quizesData){
        setQuizes(
          data.quizesData
        )
//        setMsg(data.msg)
      }else{
//            console.log(data.msg)
//        setMsg(data.msg)
      }

//          console.log(data);

    });
//    }, [user]);
    
    }

    console.log(2,quizes)

//[!] Add buttons to delete Room

  return (
    <>
      <h1>{languagePack[lang]['QUIZZES']}</h1>
      {quizes?quizes.map((quiz,index)=>{
        return (
          <div key={'quiz_'+index} style={{borderWidth:2,padding:10}}>
            {index+1}. <Link to={'/quiz/' + quiz.id}>{quiz.name}</Link>
          </div>
        )
      }):''}
      <Button onClick={addQuiz}>{languagePack[lang]['ADD_NEW_QUIZ']}</Button>
    </>
  )
}

export default Quizes