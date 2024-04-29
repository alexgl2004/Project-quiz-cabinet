import dayjs from 'dayjs';
import React, { useRef, useState, useContext, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button,
  Form,
  DatePicker,
  Input
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';

const { TextArea } = Input;
//[+] добавить возможность фиксации для уже взятых в работу тестов и вопросов, а так же добавить возможность разблокирования(!)
const Quiz = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  if(user && user.role!=2){
    navigate('/profile')
  }

//  const { quiz, getQuiz, setQuiz } = useContext(TeacherContext);

  const [ quizQuestions, setquizQuestions ] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [tempNameDescription, setTempNameDescription] = useState(null);
  const [filterQuiestion, setFilterQuiestion] = useState({text:''});
  
  const contentChanged = useRef(1);

  const dateFormat = 'YYYY-MM-DD';
  
  let params = useParams();

  useEffect(() => {
    if(quiz==null){
      getQuiz(params.id) 
    }
  })

  useEffect(() => {
    if(quiz!=null){
      filterQuestions(quiz.questions)
      contentChanged.current = 0
    }
  },[quiz])

  function getQuiz(quiz_id){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {

    fetch(path_server+'/quiz/' + quiz_id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data.quizData){
        setQuiz({
          quiz: data.quizData,
          questions: data.questionsData
        })
//          setMsg(data.msg)
      }else{
//          setMsg(data.msg)
      }
      console.log(data);
    });
//    }, [user]);
  }

  function saveQuizData(quizdata,type='saveBody'){

    if(type=='saveBody'){ //сохранять только в том случае, если quizdata - это полные данные комнаты
      setQuiz({...quizdata,type:type})
    }

    quizdata.type=type;
//    console.log(quizdata)


    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizdata),
      mode:'cors'
    };

    fetch(path_server+'/quiz/'+quiz.quiz.id+'/edit', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      setMsg(data.msg)
    });


  }
  

  const filterQuestions = (newQuizQuiz, params = null) => {

    const newQuizInQuiz = newQuizQuiz.filter((value,index)=>{
      return value.isInQuiz
    })

    const newQuizoutQuiz = newQuizQuiz.filter((value,index)=>{
      return !value.isInQuiz
    })

    setquizQuestions({
      'InQuiz':newQuizInQuiz,
      'outQuiz':newQuizoutQuiz    
    })
    
  }

  const onFilterFreeQuiestion = (text) => {

    if(text==''){
      filterQuestions(quiz.questions)
      console.log(quiz.questions)
    }else{

      const newQuizQuiz = quiz.questions.filter((value,index)=>{

        console.log(value.isInQuiz,value.header.toUpperCase(),text.toUpperCase())

        return value.isInQuiz || 
          (
            (
              !value.isInQuiz && 
              value.header.toUpperCase().indexOf(text.toUpperCase())!=-1
            )
          )



      })

      filterQuestions(newQuizQuiz)
      console.log(newQuizQuiz)
    }



//    contentChanged.current = 1

  }
  

  const outInMoveQuizquiz = (quiz_id, inOuttype) => {

    const newQuizQuiz = quiz.questions.map((value,index)=>{
      if(value.id==quiz_id){
        value.isInQuiz = (inOuttype=='in'?1:0);
      }
      return value
    })

    console.log(newQuizQuiz)

    filterQuestions(newQuizQuiz)
    contentChanged.current = 1

  }
  
/*
  function addzerro(elem){
    return (elem+'').padStart(2,'0')
  }
*/
  const saveQuiz = () => {

    /*//[!] Для даты доступа, позже
    if(!temp_room.room.date_access && running==1){
      temp_room.room.date_access = temp_days.$y+'-' + addzerro(temp_days.$M+1)+'-'+addzerro(temp_days.$D+1)
    }
*/
    let temp_quiz = 
    {
      ...quiz,
      questions:  [...quizQuestions.InQuiz,...quizQuestions.outQuiz],
    }
    
    saveQuizData(temp_quiz,'saveBody');
    contentChanged.current = 0

  }


//  console.log(5, quiz)
/*//[!] - возможно добавить время публикации к Quiz
  const onChangeAccessDatePicker = (_, dateStr) => {
    setQuiz((prev)=>{
      prev.quiz.date_access = dateStr
      return prev
    });
    contentChanged.current = 1
  }
*/

  const openEdit = () => {
    setTempNameDescription({
      name:quiz.quiz.name,
      description:quiz.quiz.description,
      params:quiz.quiz.params,
      edit:1
    })
  }

  const cancelEdit = () => {
    setTempNameDescription({
      name:quiz.quiz.name,
      description:quiz.quiz.description,
      params:quiz.quiz.params,
      edit:0
    })
  }

  const saveEdit = () => {

    setQuiz((prev)=>{
      prev.quiz.name = tempNameDescription.name;
      prev.quiz.description = tempNameDescription.description;
      prev.quiz.params = tempNameDescription.params;
      return prev;
    })

    saveQuizData(
      {
        name:tempNameDescription.name,
        description:tempNameDescription.description,
        params:tempNameDescription.params
      }
      ,'saveHeader'
    );
    
    cancelEdit()
  }

  const onChangeND = (e,field) => {
    switch(field){
      case 'filter':
        setFilterQuiestion({text:e.target.value})
        onFilterFreeQuiestion(e.target.value)
      break;
      case 'name':
        setTempNameDescription({
          name:e.target.value,
          description:tempNameDescription.description,
          params:tempNameDescription.params,
          edit:1,
        })
      break;
      case 'description':
        setTempNameDescription({
          name:tempNameDescription.name,
          description:e.target.value,
          params:tempNameDescription.params,
          edit:1,
        })
      break;
      case 'params':
        setTempNameDescription({
          name:tempNameDescription.name,
          description:tempNameDescription.description,
          params:e.target.value,
          edit:1,
        })
      break;
      
    }
  }

  return (
    <>
      {quiz?(<>
        {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
          <>
            <h1>
            {languagePack[lang]['QUIZ']}: {quiz.quiz.name}
              <Link style={{fontSize:12,float:'right'}} to='/quiz'>{languagePack[lang]['BACK_TO_QUIZZES']}</Link>
            </h1>
            
            <div className="description" style={{margin:20}}>{quiz.quiz.description}</div>
          </>:
          <>
            <Form.Item label={languagePack[lang]['NAME']}>
              <Input 
                name="name" 
                onChange={(e)=>{onChangeND(e,'name')}} 
                value={tempNameDescription.name?tempNameDescription.name:quiz.quiz.name} 
              />
            </Form.Item>
            <Form.Item label={languagePack[lang]['DESCRIPTION']}>
              <TextArea rows={4} 
                name="description" 
                onChange={(e)=>{onChangeND(e,'description')}} 
                value={tempNameDescription.description?tempNameDescription.description:quiz.quiz.description}
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
        <hr />
        <div>
          <div className="button_Block" style={{marginTop:20,width:'100%'}}>
            <Form layout="horizontal" style={{maxWidth: 1000}}>
              <Button onClick={()=>{saveQuiz()}} disabled={!contentChanged.current}>{languagePack[lang]['SAVE']}</Button><span style={{color:"red",fontWeight:"bold"}}> </span>
              <Button onClick={()=>{setQuiz(null)}}>{languagePack[lang]['RESET']}</Button>
            </Form>
          </div>
          <div className="quiz_block" style={{width:'100%',display:'flex'}}>
            <div style={{width:'60%'}}>
              <h4>{languagePack[lang]['QUESTION_IN_THE_QUIZ']}: </h4>
              <div className="quiz_in" style={{display:'flex',flexWrap:'wrap',borderStyle:'solid',borderWidth:2,padding:30,borderColor:'blue',width:"100%"}}>
              {quizQuestions && quizQuestions.InQuiz.length>0?quizQuestions.InQuiz.map((question,index)=>{
                  return (
                    <div key={'student_'+question.id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'49%',borderColor:'blue',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50,minWidth:150}}>
                      <div style={{width:'75%'}}>{question.header}</div>
                        <div><Button onClick={()=>{outInMoveQuizquiz(question.id,'out')}}>{languagePack[lang]['REMOVE']}</Button></div>
                    </div>
                  )
                }):<div>{languagePack[lang]['CLICK_TAKE_IN_QUIZ']}</div>}
              </div>
            </div>
            <div style={{width:'40%'}}>
              <h4>{languagePack[lang]['QUESTION_POOL']}:</h4>
              <Form.Item label={languagePack[lang]['FILTER']+':'} style={{padding:5,margin:0,borderStyle:'solid',borderWidth:1,borderColor:'grey',borderBottom:0}}>
                <Input 
                  name="filter" 
                  onChange={(e)=>{onChangeND(e,'filter')}}
                  value={filterQuiestion.text?filterQuiestion.text:''}
                />
              </Form.Item>
              <div className="quiz_out" style={{display:'flex',flexWrap:'wrap',borderStyle:'dotted',borderWidth:1,padding:20,borderColor:'grey',width:"100%",overflowY:'auto',height:'auto',maxHeight:400}}>
                {quizQuestions && quizQuestions.outQuiz.length>0?quizQuestions.outQuiz.map((question,index)=>{
                  return (
                    <div key={'student_'+question.id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'100%',borderColor:'grey',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50,minWidth:150}}>
                      <div style={{width:'75%'}}>{question.header}</div>
                        <div><Button onClick={()=>{outInMoveQuizquiz(question.id,'in')}}>{languagePack[lang]['ADD']}</Button></div>
                    </div>
                  )
                }):<div>{languagePack[lang]['ALL_IN_WORK_QUIZ']}</div>}
              </div>
            </div>
          </div>          
        </div>
      </>):
      ''}
    </>
  )
}

export default Quiz

/*

            <div className="Access-block">
              <div style={{display:"flex",marginTop:10,width:'100%'}}>
                <div style={{width:'25%'}}>
                  <Form.Item label="Start from">
                    <DatePicker 
                      name="start" 
                      onChange={onChangeAccessDatePicker}
                      value={quiz.quiz.date_start?dayjs(quiz.quiz.date_start, dateFormat):''} 
                      defaultValue={quiz.quiz.date_start?dayjs(quiz.quiz.date_start, dateFormat):''}
                      disabled={quiz.quiz.isRunning}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
*/