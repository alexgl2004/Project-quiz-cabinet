import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { TeacherContext } from "../../context/TeacherContext.jsx";
import {
  Button
} from 'antd';


const Rooms = () => {

  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState(null);
//  const { rooms, getRooms } = useContext(TeacherContext);

  useEffect(() => {
    getRooms()
  }, []);

  function getRooms(){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


    fetch('http://localhost:3000/users/rooms', requestOptions)
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

  return (
    <>
      {user && user.role!=1 && <Navigate replace to="/profile" />}
      <h1>Rooms</h1>
      {rooms?rooms.map((room,index)=>{
        return (
          <div key={'room_'+index} style={{borderWidth:2,padding:10}}>
            <Link to={'/rooms/' + room.id}>{index+1}. {room.name}</Link>
          </div>
        )
      }):''}
    </>
  )
}

export default Rooms