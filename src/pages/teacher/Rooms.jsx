import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import {
  Button
} from 'antd';
import { path_server } from '../../../path.js';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";
import '../teacher/css/rooms.css';


const Rooms = () => {

  const [lang] = useOutletContext();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState(null);
  const [newRoomID, setnewRoomID] = useState(null);

//  const { rooms, getRooms } = useContext(TeacherContext);

  if(user && user.role!=1){
    navigate('/profile')
  }

  if(user && newRoomID){
    navigate("/rooms/"+newRoomID)
  }

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }
    
    getRooms()

  }, [user]);

  function addRoom(){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
      mode:'cors'
    };

    fetch(path_server+'/users/rooms/add', requestOptions)
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
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {


    fetch(path_server+'/users/rooms', requestOptions)
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
      <h1>{languagePack[lang]['ROOMS']}</h1>
      <Button style={{marginBottom:20}} type="primary" onClick={addRoom}>{languagePack[lang]['ADD_NEW_ROOM']}</Button>
      {user && rooms?rooms.map((room,index)=>{
        return (
          <div key={'room_'+index} style={{borderWidth:2, marginBottom:10}}>
            
            <Link to={'/rooms/' + room.id} className='room'>
              <div className="BlockCounter">
                {index+1}
              </div>
              <div className="BlockTitle">
                {room.name}
              </div>
            </Link>

          </div>
        )
      }):''}
    </>
  )
}

export default Rooms