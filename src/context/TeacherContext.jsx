import { createContext, useEffect, useContext, useState, useRef } from "react";
import { UserContext } from "./UserContext.jsx";

export const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  
  const { user } = useContext(UserContext);

  const [teacherMsg, setMsg] = useState('');
  const [students, setStudents] = useState(null);
  const [results, setResults] = useState(null);

  function getStudents(){
//    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {


      fetch('http://localhost:3000/users/students', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
//        console.log(data)
        if(data.studentsData){
          setStudents(
            data.studentsData
          )
          setMsg(data.msg)
        }else{
//            console.log(data.msg)
          setMsg(data.msg)
        }

//          console.log(data);

      });
//    }, [user]);

  }

  function changeStundentData(stundentData){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stundentData)
    };

    fetch('http://localhost:3000/users/update', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data.isLogin){
/**
 * Изменить здесь для обновления записи в массиве тичерконтекста
 * */        
/*
        setUser(
          data.userdata
        )
*/        
        setMsg(data.msg)
      }else{
//            console.log(data.msg)
        setMsg(data.msg)
      }
//          console.log(data);

    });    

  }

  function getResults(){
    //    console.log(students)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        };        
    
    //    useEffect(() => {
    
    
          fetch('http://localhost:3000/users/results', requestOptions)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
  //          console.log(data)
            if(data.resultsData){
              setResults(
                data.resultsData
              )
              setMsg(data.msg)
            }else{
    //            console.log(data.msg)
              setMsg(data.msg)
            }
    
    //          console.log(data);
    
          });
    //    }, [user]);
    
    }  

  return (
    <TeacherContext.Provider
      value={{
        students,
        teacherMsg,
        getStudents,
        changeStundentData,
        results,
        getResults,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}  