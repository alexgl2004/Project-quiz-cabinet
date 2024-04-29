import { createContext, useEffect, useContext, useState, useRef } from "react";
//import { users } from "../data/data";
//import { router } from "expo-router";
import { path_server } from "../../path";

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));
  
  // user: null if not logged in
  // { name: string, lastLogin: Date }
  const [user, setUser] = useState(null);//useState({'email':'test','password':'12345','name':'test','userid':'123456785'});
  const [userMsg, setMsg] = useState('');

  function changeUserData(userdata){
    setUser(userdata)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userdata),
      mode:'cors'
    };

    fetch(path_server+'/users/update', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data.isLogin){
        setUser(
          data.userdata
        )
        setMsg(data.msg)
      }else{
//            console.log(data.msg)
        setMsg(data.msg)
      }
//          console.log(data);

    });    

  }

  function login(login, password) {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login, password: password }),
      mode:'cors'
    };        

//    useEffect(() => {

  
        fetch(path_server+'/users/login', requestOptions)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if(data.isLogin){
            setUser(
              data.userdata
            )
            setMsg(data.msg)
          }else{
//            console.log(data.msg)
            setMsg(data.msg)
          }

//          console.log(data);

        });
//    }, [user]);

/*
    if(password=='1' && name=='1'){
//      console.log(name, password)
      setUser(
        {
          name: name,
          email: name,
          userid: 1,
          //test data
          title: 'Mr',
          name: 'Alex',
          surname: 'GL',
          school: 'GGS Karlschule',
          birthday: '1984-02-26',
          role: 1 // teacher
        }
      );
      return true;
    }else if(password=='2' && name=='2'){
      //      console.log(name, password)
      setUser(
        {
          name: name,
          email: name,
          userid: 2,
          //test data
          title: 'Ms',
          name: 'Oksana',
          surname: 'GL',
          school: 'GGS Karlschule',
          birthday: '1983-03-31',
          role: 2 // manager
        }
      );
      return true;
    }else{
      return false;
    }
*/

  }

  function logout() {
    setUser(null);
    setMsg('');
//    alert('a')
//    clearOrder(true);
  }
  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        userMsg,
        changeUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
