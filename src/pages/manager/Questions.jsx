import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import ModalAnswer from "../../components/ModalAnswer.jsx";

import {
  Button,
  Form,
  DatePicker,
  Input
} from 'antd';

const { TextArea } = Input;


const Questions = () => {

  const { user } = useContext(UserContext);
  const [questions, setQuestions] = useState(null);
//  const [answers, setAnswers] = useState(null);  
//  const [questionID, setQuestionID] = useState(null);
  const [tempNameDescription, setTempNameDescription] = useState(null);
  const [filterQuiestion, setFilterQuiestion] = useState({text:''});

  useEffect(() => {
    getQuestions()
  }, []);

  const getTheme = (e) => {
    if(tempNameDescription.edit==1){
      setTempNameDescription({
        ...tempNameDescription,
        theme:e.target.innerText,
      })
//      console.log(e.target.innerText,'ssss')
    }
  }

  const onChangeND = (e,field) => {
    switch(field){
      case 'filter':
        setFilterQuiestion({text:e.target.value})
        onFilterFreeQuiestion(e.target.value)
      break;
      case 'header':
        setTempNameDescription({
          ...tempNameDescription,
          header:e.target.value,
        })
      break;
      case 'theme':
        setTempNameDescription({
          ...tempNameDescription,
          theme:e.target.value,
        })
      break;
      case 'text':
        setTempNameDescription({
          ...tempNameDescription,
          text:e.target.value,
        })
      break;
      case 'text_right':
        setTempNameDescription({
          ...tempNameDescription,
          text_right:e.target.value,
        })
      break;
      case 'points':
        setTempNameDescription({
          ...tempNameDescription,
          points:e.target.value,
        })
      break;

    }
  }

  const onFilterFreeQuiestion = (text) => {
    setQuestions({
      ...questions,
        filtered: questions.firstLoaded.filter((value,index)=>{
          return text=='' || (
              value.header.toUpperCase().indexOf(text.toUpperCase())!=-1
          )
        })
    })
  }

  const openEdit = () => {
    setTempNameDescription({
      header:questions.nowQuestion.header,
      text:questions.nowQuestion.text,
      theme:questions.nowQuestion.theme,
      text_right:questions.nowQuestion.text_right,
      points:questions.nowQuestion.points,
      edit:1
    })
  }

  const cancelEdit = () => {
    setTempNameDescription({
      header:questions.nowQuestion.header,
      text:questions.nowQuestion.text,
      theme:questions.nowQuestion.theme,
      text_right:questions.nowQuestion.text_right,
      points:questions.nowQuestion.points,
      edit:0
    })
  }

  const saveEdit = () => {

    saveQuestionData(tempNameDescription);
   
  }

  const saveQuestionData = () => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...tempNameDescription,user_id:user.id})
    };

    fetch('http://localhost:3000/quiz/questions/'+questions.questionID+'/edit', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      if(data.question_id){
        setQuestions((prev)=>{
          prev.firstLoaded = prev.firstLoaded.map((elem)=>{
            if(elem.id==data.question_id){
              elem = {
                ...tempNameDescription,
                id:data.question_id,
                creator_id:user.id
              }
            }
            return elem
          })

          prev.filtered = prev.filtered.map((elem)=>{
            if(elem.id==data.question_id){
              elem = {
                ...tempNameDescription,
                id:data.question_id,
                creator_id:user.id
              }
            }
            return elem
          })

          return { 
            ...prev,
            nowQuestion: data.questionData
          }
        })
        setTempNameDescription({
          ...tempNameDescription,
          edit:0
        })
        getAnswers(data.question_id)
      }else{
//       console.log(data.msg)
//       setMsg(data.msg)
      }
//    console.log(data);
    });    

  }

  function delQuestion(question_id){
    const test = confirm('Are you shure to delete?')
    if(test){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      };

      fetch('http://localhost:3000/quiz/questions/'+question_id+'/delete', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setQuestions({
          firstLoaded: data.questionsData,
          filtered: data.questionsData
        })
        setTempNameDescription(null)
      });
    }
  }

  function addQuestion(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    };

    fetch('http://localhost:3000/quiz/questions/add', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      if(data.question_id){
        setQuestions({
          firstLoaded: data.questionsData,
          filtered: data.questionsData,
          questionID: data.question_id,
          nowQuestion: data.questionData,
          nowAnswers: []
        })
        setTempNameDescription({
          ...data.questionData,
          edit:1,
        })
      }else{
//       console.log(data.msg)
//       setMsg(data.msg)
      }
//    console.log(data);
    });
  }

  function getQuestions(){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


    fetch('http://localhost:3000/quiz/questions', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//          console.log(data)
      if(data.questionsData){
        setQuestions({
          firstLoaded: data.questionsData,
          filtered: data.questionsData
        })
      }else{
//            console.log(data.msg)
      }

    });
//    }, [user]);
    
  } 

  function getAnswers(question_id){

//    console.log('question_id',question_id)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


    fetch('http://localhost:3000/quiz/questions/'+question_id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(44,data)
      if(data.questionData){
        setQuestions({
          ...questions,
          questionID: data.question_id,
          nowQuestion: data.questionData,
          nowAnswers: data.selectedAnswers
        })  
        setTempNameDescription({
          ...data.questionData,
          edit:0,
        })
      }else{
//            console.log(data.msg)
      }

    });
  }

  if(questions && questions.nowQuestion){
    console.log(2,questions.nowQuestion)
  }

//[!] Add buttons to delete Room

  let themeChange, outTheme = ''

  return (
    <>
      {user && user.role!=2 && <Navigate replace to="/profile" />}
      <h1>Questions</h1>      
      <div style={{display:'flex'}}>
        <div style={{width:'30%',overflowY:'auto',maxHeight:500}}>
          <Button onClick={addQuestion}>Add new Question +</Button>
          <Form.Item style={{padding:5,margin:0,marginTop:5, borderStyle:'solid',borderWidth:1,borderColor:'#ccc',borderBottom:0}}>
            <Input 
              name="filter" 
              onChange={(e)=>{onChangeND(e,'filter')}}
              value={filterQuiestion.text?filterQuiestion.text:''}
            />
          </Form.Item>
          <div style={{borderStyle:'solid',borderWidth:1,borderColor:'#ccc'}}>
            {questions && questions.filtered?questions.filtered.map((question,index)=>{
//                console.log(question)
                if(themeChange != question.theme){
                  themeChange = question.theme
                  outTheme = themeChange
                }else{
                  outTheme = ''
                }
                return (
                  <>
                    {outTheme?
                    <h5 onClick={(e)=>{getTheme(e)}} style={{backgroundColor:'#ccc',color:'white',cursor: 'pointer'}}>{outTheme}</h5>
                    :''
                    }
                    <div key={'question_'+index} style={{borderWidth:2,padding:2}}>
                      <Button style={{width:'80%',textAlign:'left'}} onClick={()=>{getAnswers(question.id)}}>{question.header}</Button>
                      <Button style={{marginLeft:'2%',width:'18%',textAlign:'center'}} onClick={()=>{delQuestion(question.id)}}>Del</Button>
                    </div>
                  </>
                )
              }
            )
            :''}
          </div>
        </div>
        <div style={{display:'flex', marginLeft:'2%', width:'68%', border:'1px solid #aaa', padding:2}}>
          {questions && questions.nowQuestion?
            <div style={{width:'60%',padding:10}}>
              {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
                <>
                  <h5>
                    <em>Header: </em>{tempNameDescription.header?tempNameDescription.header:questions.nowQuestion.header}
                  </h5>
                  <div className="theme_text" style={{margin:10}}><em>Theme: </em> {tempNameDescription.theme?tempNameDescription.theme:questions.nowQuestion.theme}</div>
                  <div className="description" style={{margin:10}}><em>Text of question: </em>{tempNameDescription.text?tempNameDescription.text:questions.nowQuestion.text}</div>
                  <div className="description" style={{margin:10}}><em>Text that is displayed, when answer is correct: </em>{tempNameDescription.text_right?tempNameDescription.text_right:questions.nowQuestion.text_right}</div>
                  <div className="points" style={{margin:10}}><em>Max points for correct answer: </em>{tempNameDescription.points?tempNameDescription.points:questions.nowQuestion.points}</div>
                </>:
                <>
                  <Form.Item label="Header of question">
                    <Input 
                      name="header" 
                      onChange={(e)=>{onChangeND(e,'header')}} 
                      value={tempNameDescription.header}
                    />
                  </Form.Item>
                  <Form.Item label="Theme of question">
                    <Input 
                      name="theme" 
                      onChange={(e)=>{onChangeND(e,'theme')}} 
                      value={tempNameDescription.theme}
                    />
                  </Form.Item>
                  <Form.Item label="Text of question">
                    <TextArea rows={4} 
                      name="text" 
                      onChange={(e)=>{onChangeND(e,'text')}} 
                      value={tempNameDescription.text}
                    />
                  </Form.Item>
                  <Form.Item label="Text that is displayed, when answer is correct">
                    <TextArea rows={4} 
                      name="text_right" 
                      onChange={(e)=>{onChangeND(e,'text_right')}} 
                      value={tempNameDescription.text_right}
                    />
                  </Form.Item>
                  <Form.Item label="Max points for correct answer">
                    <Input 
                      name="points" 
                      onChange={(e)=>{onChangeND(e,'points')}} 
                      value={tempNameDescription.points}
                    />
                  </Form.Item>
                </>
              }
              {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
                <>
                  <Button onClick={openEdit}>Edit header and text</Button>
                </>:
                <>
                  <Button onClick={saveEdit}>Save</Button>
                  <Button onClick={cancelEdit}>Cancel</Button>
                </>
              }
            </div>
          :
            <></>
          }
          <div style={{borderLeft:'1px solid #ccc',width:'40%',padding:10,overflowY:'auto',maxHeight:500}}>
            {questions && questions.nowAnswers?
              <>
                <h5>Answers of question</h5>
                <ModalAnswer getAnswers={getAnswers} add="1" questionId={questions.questionID} />
                {questions.nowAnswers.map((answer,index)=>{
                  return (
                    <div key={'answers_'+index} style={{position:"relative",border:'1px solid #ccc',padding:10,marginTop:5,minHeight:50}}>
                      <div><em>Correct: </em>{answer.correct?'Yes':'No'}</div>
                      <div style={{marginTop:5}}><em>Answer: </em>{answer.answer}</div>
                      <div style={{marginTop:5}}><em>Comment: </em>{answer.comment}</div>
                      <div style={{position:"absolute",top:10,right:10}}>
                        <ModalAnswer getAnswers={getAnswers} answerContent={answer} questionId={questions.questionID} answerId={answer.id} />
                      </div>
                    </div>
                    )
                  })
                }
              </>
            :tempNameDescription && tempNameDescription.edit==1?'Adding new question':'Select question in left side'
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Questions