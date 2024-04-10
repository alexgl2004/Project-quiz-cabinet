import { createContext, useEffect, useContext, useState, useRef } from "react";
import { UserContext } from "./UserContext.jsx";

export const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  
  const { user } = useContext(UserContext);

  const [teacherMsg, setMsg] = useState('');
  const [results, setResults] = useState(null);


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
        teacherMsg,
        results,
        getResults,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}  