import dayjs from 'dayjs';
import React, { useRef, useState, useContext, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { TeacherContext } from "../../context/TeacherContext.jsx";
import {
  Button,
  Form,
  DatePicker,
  Input,
  Checkbox
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";
import './css/rooms.css';
import './css/student.css';

const { TextArea } = Input;

//[+] добавить возможность остановки прохождения для 1-го пользователя
//[+] Добавить параметр свободное прохождение или прохождение четко на установленное с момента запуска тестирования

const Room = () => {

  const [lang,nameAddColorCss] = useOutletContext();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

//  const { room, getRoom, setRoom } = useContext(TeacherContext);

  const [ studentsRoom, setStudentsRoom ] = useState(null);
  const [ quizesRoom, setQuizesRoom ] = useState(null);
  const [room, setRoom] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [tempNameDescription, setTempNameDescription] = useState(null);
  const contentChanged = useRef(1);

  const dateFormat = 'YYYY-MM-DD';
  
  let params = useParams();

  if(user && user.role!=1){
    navigate('/profile')
  }

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }

    if(room==null){
      getRoom(params.id) 
    }

  }, [user]);

  useEffect(() => {
    if(room!=null){
      filterStudens(room.students)
      filterQuizes(room.quizes)
      contentChanged.current = 0
    }
  },[room])

  function getRoom(room_id){
    //    console.log(students)

    if(user==null) return 

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {

    fetch(path_server+'/users/rooms/' + room_id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data.roomData){
        setRoom({
          room: data.roomData,
          students: data.studentsData,
          quizes: data.quizesData
        })
//          setMsg(data.msg)
      }else{
//          setMsg(data.msg)
      }
      console.log(data);
    });
//    }, [user]);
  }

  function saveRoomData(roomdata,type='saveBody'){

    if(type=='saveBody'){ //сохранять только в том случае, если roomdata - это полные данные комнаты
      setRoom({...roomdata,type:type})
    }

    roomdata.type=type;    

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomdata),
      mode:'cors'
    };

    fetch(path_server+'/users/rooms/'+room.room.id+'/edit', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      setMsg(data.msg)
    });


  }
  

  const filterQuizes = (newRoomQuiz) => {

    const newRoomInQuiz = newRoomQuiz.filter((value,index)=>{
      return value.isInRoom
    })

    const newRoomOutQuiz = newRoomQuiz.filter((value,index)=>{
      return !value.isInRoom
    })

    setQuizesRoom({
      'inRoom':newRoomInQuiz,
      'outRoom':newRoomOutQuiz    
    })
    
  }

  const outInMoveQuizRoom = (quiz_id, inOuttype) => {

    const newRoomQuiz = room.quizes.map((value,index)=>{
      if(value.id==quiz_id){
        value.isInRoom = (inOuttype=='in'?1:0);
      }
      return value
    })

    filterQuizes(newRoomQuiz)
    contentChanged.current = 1

  }  


  const filterStudens = (newRoomStudent) => {

    const newRoomInStudent = newRoomStudent.filter((value,index)=>{
      return value.isInRoom
    })

    const newRoomOutStudent = newRoomStudent.filter((value,index)=>{
      return !value.isInRoom
    })

    setStudentsRoom({
      'inRoom':newRoomInStudent,
      'outRoom':newRoomOutStudent    
    }) 
    
  }

  const outInMoveStudentRoom = (user_id, inOuttype) => {

    const newRoomStudent = room.students.map((value,index)=>{
      if(value.user_id==user_id){
        value.isInRoom = (inOuttype=='in'?1:0);
      }
      return value
    })

    filterStudens(newRoomStudent)
    contentChanged.current = 1

  }

  function addzerro(elem){
    return (elem+'').padStart(2,'0')
  }

  const saveRoom = (running=0) => {

    //2 - full stop

    let temp_room = {...room}
    let temp_days = dayjs()

//    console.log('aaaa',temp_days)

    if(running==2){
      temp_room.room.date_end = temp_days.$y+'-' + addzerro(temp_days.$M+1)+'-'+addzerro(temp_days.$D+1)
      temp_room.room.stopedNow = 1
    }else{
      if(!temp_room.room.date_start && running==1){
        temp_room.room.date_start = temp_days.$y+'-' + addzerro(temp_days.$M+1)+'-'+addzerro(temp_days.$D+1)
      }
      if(!temp_room.room.date_end && running==1){
        temp_days = dayjs().add(1, 'day')
        temp_room.room.end = temp_days.$y+'-' + addzerro(temp_days.$M+1)+'-'+addzerro(temp_days.$D+1)
      }
    }

    temp_room.room.isRunning = (running==2?0:running)

    temp_room = 
    {
      ...temp_room,
      students: [...studentsRoom.inRoom,...studentsRoom.outRoom],
      quizes:  [...quizesRoom.inRoom,...quizesRoom.outRoom],
    }

//    setRoom(temp_room);

    saveRoomData(temp_room,'saveBody');
    contentChanged.current = 0

  }

  const saveAndStartRoom = () => {
    saveRoom(1)
  }

  const saveAndStopRoom = () => {
    saveRoom(2)
  }

//  console.log(5, room)

  const onChangeStartDatePicker = (_, dateStr) => {
    contentChanged.current = 1
    setRoom((prev)=>{
      prev.room.date_start = dateStr
      return {...prev}
    });
  }

  const onChangeEndDatePicker = (_, dateStr) => {
    contentChanged.current = 1
    setRoom((prev)=>{
      prev.room.date_end = dateStr
      return {...prev}
    });
  }

  const openEdit = () => {
    setTempNameDescription({
      name:room.room.name,
      description:room.room.description,
      edit:1
    })
  }

  const cancelEdit = () => {
    setTempNameDescription({
      name:room.room.name,
      description:room.room.description,
      edit:0
    })
  }

  const saveEdit = () => {

    setRoom((prev)=>{
      prev.room.name = tempNameDescription.name;
      prev.room.description = tempNameDescription.description;
      return {...prev}
    })

    saveRoomData(
      {
        name:tempNameDescription.name,
        description:tempNameDescription.description
      }
      ,'saveHeader'
    );
    
    cancelEdit()
  }

  const onChangeND = (e,field) => {
    switch(field){
      case 'show_results':
        contentChanged.current = 1
        setRoom((prev)=>{
          prev.room.show_results = (e.target.checked?1:0)
          return {...prev}
        });
      break;
      case 'name':
        setTempNameDescription({
          name:e.target.value,
          description:tempNameDescription.description,
          edit:1,
        })
      break;
      case 'description':
        setTempNameDescription({
          name:tempNameDescription.name,
          description:e.target.value,
          edit:1,
        })
      break;
    }
  }

  

  


  return (
    <>
      {room?(<>
        {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
          <>
            <h1 className={'color'+nameAddColorCss}>
              {languagePack[lang]['ROOM']}: {room.room.name}
              <Link className={'color'+nameAddColorCss+" backButtonTop"} to='/rooms'>{languagePack[lang]['BACK_TO_ROOMS']}</Link>
            </h1>
            <div className="description" style={{margin:20}}>
              {room.room.description}
              <Button type="primary" style={{marginLeft:20}} onClick={openEdit}>{languagePack[lang]['EDIT_HEADER_AND_TEXT']}</Button>
            </div>
            
          </>:
          <>
            <div className='blockIn'>
              <Form.Item label={languagePack[lang]['NAME']}>
                <Input 
                  name="name" 
                  onChange={(e)=>{onChangeND(e,'name')}} 
                  value={tempNameDescription.name}
                />
              </Form.Item>
              <Form.Item label={languagePack[lang]['DESCRIPTION']}>
                <TextArea rows={4} 
                  name="description" 
                  onChange={(e)=>{onChangeND(e,'description')}} 
                  value={tempNameDescription.description}
                />
              </Form.Item>
              <>
                <Button type="primary" onClick={saveEdit}>{languagePack[lang]['SAVE']}</Button>
                <Button style={{marginLeft:8}} onClick={cancelEdit}>{languagePack[lang]['CANCEL']}</Button>
              </>
            </div>
          </>
        }
        <hr />

        <div className='blockIn'>
          <div style={{display:'flex'}}>
              <div className="students_block" style={{width:"50%"}}>
                {!room.room.isRunning?
                  <div>
                    <h4 className='h4-left'>{languagePack[lang]['STUDENTS_AVAILABLE']}:</h4>
                    <div className="room_out" style={{display:'flex',flexWrap:'wrap',borderStyle:'dotted',borderWidth:1,padding:20,borderColor:'grey',width:"100%",overflowY:'auto',height:150}}>
                      {studentsRoom && studentsRoom.outRoom.length>0?studentsRoom.outRoom.map((student,index)=>{
                        return (
                          <div key={'student_'+student.user_id} className="small-block-out">
                            <div style={{width:'100%'}}>{student.name} {student.surname}</div>
                            {!room.room.isRunning?
                              <div><Button type="primary" onClick={()=>{outInMoveStudentRoom(student.user_id,'in')}}>{languagePack[lang]['ADD']}</Button></div>:
                              ''
                            }
                          </div>
                        )
                      }):<div>{languagePack[lang]['ALL_IN_WORK_ROOM']}</div>}
                    </div>
                  </div>:''
                }
                <div>
                  <h4 className='h4-left'>{languagePack[lang]['STUDENTS_PARTICIPTING']}:</h4>
                  <div className="room_in" style={{display:'flex',flexWrap:'wrap',borderStyle:'solid',borderWidth:2,padding:30,borderColor:'#00aaff',width:"100%"}}>
                  {studentsRoom && studentsRoom.inRoom.length>0?studentsRoom.inRoom.map((student,index)=>{
                      return (
                        <div key={'student_'+student.user_id} className="small-block-in">
                          <div style={{width:'100%'}}>{student.name} {student.surname}</div>
                          {!room.room.isRunning?
                            <div><Button type="primary" onClick={()=>{outInMoveStudentRoom(student.user_id,'out')}}>{languagePack[lang]['REMOVE']}</Button></div>:
                            ''
                          }
                        </div>
                      )
                    }):<div>{languagePack[lang]['CLICK_TAKE_IN_ROOM']}</div>}
                  </div>
                </div>
              </div>
              <div className="quiz_block" style={{width:'50%'}}>
                {!room.room.isRunning?
                  <div>
                    <h4 className='h4-right'>{languagePack[lang]['QUIZZES_AVAILABLE']}: </h4>
                    <div className="room_out" style={{display:'flex',flexWrap:'wrap',borderStyle:'dotted',borderWidth:1,padding:20,borderColor:'grey',overflowY:'auto',height:150,marginLeft:'2%',width:"98%"}}>
                      {quizesRoom && quizesRoom.outRoom.length>0?quizesRoom.outRoom.map((quiz,index)=>{
                        return (
                          <div key={'student_'+quiz.id} className="small-block-out">
                            <div style={{width:'100%'}}>{quiz.name} {quiz.surname}</div>
                            {!room.room.isRunning?
                              <div><Button type="primary" onClick={()=>{outInMoveQuizRoom(quiz.id,'in')}}>{languagePack[lang]['ADD']}</Button></div>
                              :
                              ''
                            }
                          </div>
                        )
                      }):<div>{languagePack[lang]['ALL_IN_WORK_QUIZ_ROOM']}</div>}
                    </div>
                  </div>:''
                }
                <div>
                  <h4 className='h4-right'>{languagePack[lang]['QUIZZES_ACCEPTED']}:</h4>
                  <div className="room_in" style={{display:'flex',flexWrap:'wrap',borderStyle:'solid',borderWidth:2,padding:30,borderColor:'#00aaff',marginLeft:'2%',width:"98%"}}>
                  {quizesRoom && quizesRoom.inRoom.length>0?quizesRoom.inRoom.map((quiz,index)=>{
                      return (
                        <div key={'student_'+quiz.id} className="small-block-in">
                          <div style={{width:'100%'}}>{quiz.name} {quiz.surname}</div>
                          {!room.room.isRunning?
                            <div><Button type="primary" onClick={()=>{outInMoveQuizRoom(quiz.id,'out')}}>{languagePack[lang]['REMOVE']}</Button></div>
                            :
                            ''
                          }
                        </div>
                      )
                    }):<div>{languagePack[lang]['CLICK_TAKE_IN_QUIZ_TO_ROOM']}</div>}
                  </div>
                </div>
              </div>
          </div>
          <hr />
          <div className="button_Block" style={{marginTop:20,width:'100%'}}>
            <Form layout="horizontal" style={{maxWidth: 1000}}>
              <div className="Start-block">
                <div style={{display:"flex",marginTop:10,width:'100%'}}>
                  <div style={{width:'25%'}}>
                    <Form.Item label={languagePack[lang]['START_FROM']}>
                      <DatePicker 
                        name="start" 
                        onChange={onChangeStartDatePicker}
                        value={room.room.date_start?dayjs(room.room.date_start, dateFormat):''} 
                        defaultValue={room.room.date_start?dayjs(room.room.date_start, dateFormat):''}
                        disabled={room.room.isRunning}
                      />
                    </Form.Item>
                  </div>
                  <div style={{width:'25%'}}>
                    <Form.Item label={languagePack[lang]['TO']}>
                      <DatePicker 
                        name="end" 
                        onChange={onChangeEndDatePicker}
                        value={room.room.date_end?dayjs(room.room.date_end, dateFormat):''} 
                        defaultValue={room.room.date_end?dayjs(room.room.date_end, dateFormat):''}
                        disabled={room.room.isRunning}
                      />
                    </Form.Item>
                  </div>
                  <div style={{width:'25%'}}>
                    <Checkbox value="1" checked={room.room.show_results && room.room.show_results?true:false} onChange={(e)=>{onChangeND(e,'show_results')}} disabled={room.room.isRunning}>{languagePack[lang]['SHOW_RESULTS_STUDENTS']}</Checkbox>
                  </div>
                  <div style={{}}>
                    {!room.room.isRunning?(
                      <Button type="primary" onClick={saveAndStartRoom} disabled={quizesRoom && quizesRoom.inRoom && quizesRoom.inRoom.length>0 && studentsRoom && studentsRoom.inRoom && studentsRoom.inRoom.length>0?false:true}>{languagePack[lang]['SAVE_AND_START']}</Button>
                    ):''}
                    {room.room.isRunning?(
                      <Button onClick={saveAndStopRoom}>{languagePack[lang]['STOP']}</Button>
                    ):''}
                  </div>
                </div>
              </div>
              <Button type="primary" onClick={()=>{saveRoom(room.room.isRunning)}} disabled={room.room.isRunning || !contentChanged.current}>{languagePack[lang]['SAVE']}</Button><span style={{color:"red",fontWeight:"bold"}}> </span>
              <Button style={{marginLeft:8}} onClick={()=>{navigate('/rooms')}} disabled={room.room.isRunning}>{languagePack[lang]['RESET']}</Button>
            </Form>
          </div>
        </div>
      </>):
      ''}
    </>
  )
}

export default Room