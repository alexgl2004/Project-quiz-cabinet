import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button
} from 'antd';


const Rooms = () => {

  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState(null);
  const [newRoomID, setnewRoomID] = useState(null);
//  const { rooms, getRooms } = useContext(TeacherContext);

  useEffect(() => {
    getRooms()
  }, []);

  function addRoom(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    };

    fetch('http://192.168.2.134:3000/users/rooms/add', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      if(data.room_id){
        setnewRoomID(data.room_id)
      }else{
//       console.log(data.msg)
//       setMsg(data.msg)
      }
//    console.log(data);
    });
  }

  function getRooms(){

    if(user==null) return 
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


    fetch('http://192.168.2.134:3000/users/rooms', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//          console.log(data)
      if(data.roomsData){
        setRooms(
          data.roomsData
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

//  console.log(2,rooms)

//[!] Add buttons to delete Room

  return (
    <>
      {user && user.role!=1 && <Navigate replace to="/profile" />}
      {user && newRoomID?<><Navigate replace to={"/rooms/"+newRoomID} /></>:''}
      <h1>Rooms</h1>
      {user && rooms?rooms.map((room,index)=>{
        return (
          <div key={'room_'+index} style={{borderWidth:2,padding:10}}>
            {index+1}. <Link to={'/rooms/' + room.id}>{room.name}</Link>
          </div>
        )
      }):''}
      <Button onClick={addRoom}>Add new Room</Button>
    </>
  )
}

export default Rooms