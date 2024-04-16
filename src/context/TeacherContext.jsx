import { createContext, useEffect, useContext, useState, useRef } from "react";
import { UserContext } from "./UserContext.jsx";

export const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  
  const { user } = useContext(UserContext);

  const [teacherMsg, setMsg] = useState('');
  
  return (
    <TeacherContext.Provider
      value={{
        teacherMsg,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}  