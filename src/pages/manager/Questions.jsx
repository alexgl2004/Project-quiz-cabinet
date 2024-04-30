import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import ModalAnswer from "../../components/ModalAnswer.jsx";
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";

import {
  Button,
  Form,
  DatePicker,
  Input
} from 'antd';

const { TextArea } = Input;

const Questions = () => {

  const [lang] = useOutletContext();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();


  const [questions, setQuestions] = useState(null);
//  const [answers, setAnswers] = useState(null);  
//  const [questionID, setQuestionID] = useState(null);
  const [tempNameDescription, setTempNameDescription] = useState(null);
  const [filterQuestion, setFilterQuestion] = useState({text:''});

  if(user && user.role!=2){
    navigate('/profile')
  }      
  
  useEffect(() => {

    if(user==null){
      navigate('/login')
    }
    
    getQuestions()

  }, [user]);

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
        setFilterQuestion({text:e.target.value})
        onFilterFreeQuestion(e.target.value)
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

  const onFilterFreeQuestion = (text) => {
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
      body: JSON.stringify({
        ...tempNameDescription,
        user_id:user.id
      }),
      mode:'cors'
    };

    fetch(path_server+'/quiz/questions/'+questions.questionID+'/edit', requestOptions)
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
    const test = confirm(languagePack[lang]['DELETE?'])
    if(test){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
        mode:'cors'
      };

      fetch(path_server+'/quiz/questions/'+question_id+'/delete', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if(!data.isDeleted){
          alert(languagePack[lang]['ALREADY_IN_USE'])
        }
        setQuestions({
          firstLoaded: data.questionsData,
          filtered: data.questionsData
        })
        console.log(question_id, data.questionsData)
        setTempNameDescription(null)
      });
    }
  }

  function addQuestion(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
      mode:'cors'
    };

    fetch(path_server+'/quiz/questions/add', requestOptions)
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

    if(user==null) return

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {


    fetch(path_server+'/quiz/questions', requestOptions)
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
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {


    fetch(path_server+'/quiz/questions/'+question_id, requestOptions)
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
      <h1>{languagePack[lang]['QUESTIONS']}</h1>
      <div style={{display:'flex'}}>
        <div style={{width:'30%',overflowY:'auto',maxHeight:500}}>
          <Button type="primary" onClick={addQuestion}>{languagePack[lang]['ADD_NEW_QUESTION']}</Button>
          <Form.Item style={{padding:5,margin:0,marginTop:5, borderStyle:'solid',borderWidth:2,borderColor:'#007AAE',borderBottom:0}}>
            <Input 
              placeholder={languagePack[lang]['FILTER_BY_NAME']}
              name="filter" 
              onChange={(e)=>{onChangeND(e,'filter')}}
              value={filterQuestion.text?filterQuestion.text:''}
            />
          </Form.Item>
          <div style={{borderStyle:'solid',borderWidth:2,borderColor:'#007AAE'}}>
            {questions && questions.filtered?questions.filtered.map((question,index)=>{
//                console.log(question)
                if(themeChange != question.theme){
                  themeChange = question.theme
                  outTheme = themeChange
                }else{
                  outTheme = ''
                }
                return (
                  <div key={'question_block_'+index}>
                    {outTheme?
                    <h5 onClick={(e)=>{getTheme(e)}} style={{backgroundColor:'#007AAE',color:'white',cursor: 'pointer',padding: '5px 10px', marginTop:5}}>{outTheme}</h5>
                    :''
                    }
                    <div key={'question_'+index} style={{borderWidth:2,padding:2, margin:3}}>
                      <Button style={{width:'80%',textAlign:'left'}} onClick={()=>{getAnswers(question.id)}}>{question.header}</Button>
                      <Button style={{color:'#B84A5B',marginLeft:'2%',width:'18%',textAlign:'center'}} onClick={()=>{delQuestion(question.id)}}>{languagePack[lang]['DELETE_BUTTON']}</Button>
                    </div>
                    </div>
                )
              }
            )
            :''}
          </div>
        </div>
        <div style={{display:'flex', marginLeft:'2%', width:'68%', border:'1px solid #aaa', padding:2,backgroundColor:'white'}}>
          {questions && questions.nowQuestion?
            <div style={{width:'60%',padding:10}}>
              {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
                <>
                  <h5>
                    <em>{languagePack[lang]['HEADER']}: </em>{tempNameDescription.header?tempNameDescription.header:questions.nowQuestion.header}
                  </h5>
                  <div className="theme_text" style={{margin:10}}><em>{languagePack[lang]['THEME']}: </em> {tempNameDescription.theme?tempNameDescription.theme:questions.nowQuestion.theme}</div>
                  <div className="description" style={{margin:10}}><em>{languagePack[lang]['TEXT_OF_QUESTION']}: </em>{tempNameDescription.text?tempNameDescription.text:questions.nowQuestion.text}</div>
                  <div className="description" style={{margin:10}}><em>{languagePack[lang]['TEXT_CORRECT_ANSWER']}: </em>{tempNameDescription.text_right?tempNameDescription.text_right:questions.nowQuestion.text_right}</div>
                  <div className="points" style={{margin:10}}><em>{languagePack[lang]['TEXT_MAX_POINTS']}: </em>{tempNameDescription.points?tempNameDescription.points:questions.nowQuestion.points}</div>
                </>:
                <>
                  <Form.Item label={languagePack[lang]['HEADER_OF_QUESTION']}>
                    <Input 
                      name="header" 
                      onChange={(e)=>{onChangeND(e,'header')}} 
                      value={tempNameDescription.header}
                    />
                  </Form.Item>
                  <Form.Item label={languagePack[lang]['THEME_OF_QUESTION']}>
                    <Input 
                      name="theme" 
                      onChange={(e)=>{onChangeND(e,'theme')}} 
                      value={tempNameDescription.theme}
                    />
                  </Form.Item>
                  <Form.Item label={languagePack[lang]['TEXT_OF_QUESTION']}>
                    <TextArea rows={4} 
                      name="text" 
                      onChange={(e)=>{onChangeND(e,'text')}} 
                      value={tempNameDescription.text}
                    />
                  </Form.Item>
                  <Form.Item label={languagePack[lang]['TEXT_CORRECT_ANSWER']}>
                    <TextArea rows={4} 
                      name="text_right" 
                      onChange={(e)=>{onChangeND(e,'text_right')}} 
                      value={tempNameDescription.text_right}
                    />
                  </Form.Item>
                  <Form.Item label={languagePack[lang]['TEXT_MAX_POINTS']}>
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
                  <Button onClick={openEdit}>{languagePack[lang]['EDIT_HEADER_AND_TEXT']}</Button>
                </>:
                <>
                  <Button onClick={saveEdit}>{languagePack[lang]['SAVE']}</Button>
                  <Button onClick={cancelEdit}>{languagePack[lang]['CANCEL']}</Button>
                </>
              }
            </div>
          :
            <></>
          }
          <div style={{borderLeft:'1px solid #ccc',width:'40%',padding:10,overflowY:'auto',maxHeight:500}}>
            {questions && questions.nowAnswers?
              <>
                <h5>{languagePack[lang]['ANSWERS OF QUIESTION']}</h5>
                <ModalAnswer getAnswers={getAnswers} add="1" questionId={questions.questionID} />
                {questions.nowAnswers.map((answer,index)=>{
                  return (
                    <div key={'answers_'+index} style={{position:"relative",border:'1px solid #ccc',padding:10,marginTop:5,minHeight:50}}>
                      <div><em>{languagePack[lang]['CORRECT']}: </em>{answer.correct?languagePack[lang]['YES']:languagePack[lang]['NO']}</div>
                      <div style={{marginTop:5}}><em>{languagePack[lang]['ANSWER']}: </em>{answer.answer}</div>
                      <div style={{marginTop:5}}><em>{languagePack[lang]['COMMENT']}: </em>{answer.comment}</div>
                      <div style={{position:"absolute",top:10,right:10}}>
                        <ModalAnswer getAnswers={getAnswers} answerContent={answer} questionId={questions.questionID} answerId={answer.id} />
                      </div>
                    </div>
                    )
                  })
                }
              </>
            :tempNameDescription && tempNameDescription.edit==1?languagePack[lang]['ADD_NEW_QUESTION']:languagePack[lang]['SELECT_QUESTION_IN_LEFT_SIDE']
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Questions