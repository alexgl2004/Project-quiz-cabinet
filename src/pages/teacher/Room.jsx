import dayjs from 'dayjs';
import React, { useRef, useState, useContext, useEffect } from 'react'
import { Navigate, Outlet, Link, useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { TeacherContext } from "../../context/TeacherContext.jsx";
import {
  Button,
  Form,
  DatePicker,
  Input
} from 'antd';

const { TextArea } = Input;

//[+] добавить возможность остановки прохождения для 1-го пользователя
//[+] Добавить параметр свободное прохождение или прохождение четко на установленное с момента запуска тестирования

const Room = () => {

  const { user } = useContext(UserContext);
//  const { room, getRoom, setRoom } = useContext(TeacherContext);

  const [ studentsRoom, setStudentsRoom ] = useState(null);
  const [ quizesRoom, setQuizesRoom ] = useState(null);
  const [room, setRoom] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [tempNameDescription, setTempNameDescription] = useState(null);
  const contentChanged = useRef(1);

  const dateFormat = 'YYYY-MM-DD';
  
  let params = useParams();

  useEffect(() => {
    if(room==null){
      getRoom(params.id) 
    }
  })

  useEffect(() => {
    if(room!=null){
      filterStudens(room.students)
      filterQuizes(room.quizes)
      contentChanged.current = 0
    }
  },[room])

  function getRoom(room_id){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {

    fetch('http://localhost:3000/users/rooms/' + room_id, requestOptions)
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
//      console.log(data);
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
      body: JSON.stringify(roomdata)
    };

    fetch('http://localhost:3000/users/rooms/'+room.room.id+'/edit', requestOptions)
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
    setRoom((prev)=>{
      prev.room.date_start = dateStr
      return prev
    });
    contentChanged.current = 1
  }

  const onChangeEndDatePicker = (_, dateStr) => {
    setRoom((prev)=>{
      prev.room.date_end = dateStr
      return prev
    });
    contentChanged.current = 1
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
      return prev;
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
      {user && user.role!=1 && <Navigate replace to="/profile" />}
      {room?(<>
        {tempNameDescription==null || (tempNameDescription && !tempNameDescription.edit)?
          <>
            <h1>
              Room: {room.room.name}
              <Link style={{fontSize:12,float:'right'}} to='/rooms'>Back to the Rooms</Link>
            </h1>
            
            <div className="description" style={{margin:20}}>{room.room.description}</div>
          </>:
          <>
            <Form.Item label="Name">
              <Input 
                name="name" 
                onChange={(e)=>{onChangeND(e,'name')}} 
                value={tempNameDescription.name}
              />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea rows={4} 
                name="description" 
                onChange={(e)=>{onChangeND(e,'description')}} 
                value={tempNameDescription.description}
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
        <hr />
        <div className="button_Block" style={{marginTop:20,width:'100%'}}>
          <Form layout="horizontal" style={{maxWidth: 1000}}>
            <div className="Start-block">
              <div style={{display:"flex",marginTop:10,width:'100%'}}>
                <div style={{width:'25%'}}>
                  <Form.Item label="Start from">
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
                  <Form.Item label="to">
                    <DatePicker 
                      name="end" 
                      onChange={onChangeEndDatePicker}
                      value={room.room.date_end?dayjs(room.room.date_end, dateFormat):''} 
                      defaultValue={room.room.date_end?dayjs(room.room.date_end, dateFormat):''}
                      disabled={room.room.isRunning}
                    />
                  </Form.Item>
                </div>
                <div style={{}}>
                  {!room.room.isRunning?(
                    <Button onClick={saveAndStartRoom} disabled={quizesRoom && quizesRoom.inRoom && quizesRoom.inRoom.length>0 && studentsRoom && studentsRoom.inRoom && studentsRoom.inRoom.length>0?false:true}>Save and start</Button>
                  ):''}
                  {room.room.isRunning?(
                    <Button onClick={saveAndStopRoom}>Stop</Button>
                  ):''}
                </div>
              </div>
            </div>
            <Button onClick={()=>{saveRoom(room.room.isRunning)}} disabled={room.room.isRunning || !contentChanged.current}>Save</Button><span style={{color:"red",fontWeight:"bold"}}> </span>
            <Button onClick={()=>{setRoom(null)}} disabled={room.room.isRunning}>RESET</Button>
          </Form>
        </div>
        <hr />
        <div style={{display:'flex'}}>
            <div className="students_block" style={{width:"50%"}}>
              {!room.room.isRunning?
                <div>
                  <h4>Students available:</h4>
                  <div className="room_out" style={{display:'flex',flexWrap:'wrap',borderStyle:'dotted',borderWidth:1,padding:20,borderColor:'grey',width:"100%",overflowY:'auto',height:150}}>
                    {studentsRoom && studentsRoom.outRoom.length>0?studentsRoom.outRoom.map((student,index)=>{
                      return (
                        <div key={'student_'+student.user_id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'49%',borderColor:'grey',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50}}>
                          <div style={{width:'75%'}}>{student.name} {student.surname}</div>
                          {!room.room.isRunning?
                            <div><Button onClick={()=>{outInMoveStudentRoom(student.user_id,'in')}}>Add</Button></div>:
                            ''
                          }
                        </div>
                      )
                    }):<div>All in work! Click "Take out" for remove student from room</div>}
                  </div>
                </div>:''
              }
              <div>
                <h4>Students participating:</h4>
                <div className="room_in" style={{display:'flex',flexWrap:'wrap',borderStyle:'solid',borderWidth:2,padding:30,borderColor:'blue',width:"100%"}}>
                {studentsRoom && studentsRoom.inRoom.length>0?studentsRoom.inRoom.map((student,index)=>{
                    return (
                      <div key={'student_'+student.user_id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'49%',borderColor:'blue',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50}}>
                        <div style={{width:'75%'}}>{student.name} {student.surname}</div>
                        {!room.room.isRunning?
                          <div><Button onClick={()=>{outInMoveStudentRoom(student.user_id,'out')}}>Remove</Button></div>:
                          ''
                        }
                      </div>
                    )
                  }):<div>Click "Take in" for add student to room</div>}
                </div>
              </div>
            </div>
            <div className="quiz_block" style={{width:'50%'}}>
              {!room.room.isRunning?
                <div>
                  <h4>Qizzes available: </h4>
                  <div className="room_out" style={{display:'flex',flexWrap:'wrap',borderStyle:'dotted',borderWidth:1,padding:20,borderColor:'grey',width:"100%",overflowY:'auto',height:150}}>
                    {quizesRoom && quizesRoom.outRoom.length>0?quizesRoom.outRoom.map((quiz,index)=>{
                      return (
                        <div key={'student_'+quiz.id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'49%',borderColor:'grey',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50}}>
                          <div style={{width:'75%'}}>{quiz.name} {quiz.surname}</div>
                          {!room.room.isRunning?
                            <div><Button onClick={()=>{outInMoveQuizRoom(quiz.id,'in')}}>Add</Button></div>
                            :
                            ''
                          }
                        </div>
                      )
                    }):<div>All in work! Click "Take out" for remove quiz from room</div>}
                  </div>
                </div>:''
              }
              <div>
                <h4>Qizzes accepted:</h4>
                <div className="room_in" style={{display:'flex',flexWrap:'wrap',borderStyle:'solid',borderWidth:2,padding:30,borderColor:'blue',width:"100%"}}>
                {quizesRoom && quizesRoom.inRoom.length>0?quizesRoom.inRoom.map((quiz,index)=>{
                    return (
                      <div key={'student_'+quiz.id} style={{display:'flex',borderStyle:'solid',borderWidth:2,padding:10,width:'49%',borderColor:'blue',marginBottom:4,marginLeft:"1%",cursor:'pointer',height:50}}>
                        <div style={{width:'75%'}}>{quiz.name} {quiz.surname}</div>
                        {!room.room.isRunning?
                          <div><Button onClick={()=>{outInMoveQuizRoom(quiz.id,'out')}}>Remove</Button></div>
                          :
                          ''
                        }
                      </div>
                    )
                  }):<div>Click "Take in" for add quiz to room</div>}
                </div>
              </div>
            </div>
        </div>
      </>):
      ''}
    </>
  )
}

export default Room