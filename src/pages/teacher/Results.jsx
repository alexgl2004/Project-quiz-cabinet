import React, { useState, useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import QRCode from "react-qr-code";
import { Button, Modal, Space } from 'antd';

const Results = () => {

  const { user } = useContext(UserContext);
  const [results, setResults] = useState(null);

  useEffect(() => {
    getResults()
  }, []);

  function getResults(){

    if(user==null) return

//    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    };

    fetch(
      user.role==3?
      'http://localhost:3000/users/results/student'
      :
      'http://localhost:3000/users/results', 
      requestOptions
    )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//          console.log(data)
      if(data.resultsData){
        setResults(
          data.resultsData
        )
      }else{
//            console.log(data.msg)
      }

//          console.log(data);

    });

  }  


  const info = (value,name) => {
    Modal.info({
      title: 'QR code for '+name,
      content: (
        <div>
          <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "200px" }}>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={value}
                viewBox={`0 0 256 256`}
              />
          </div>
        </div>
      ),
      onOk() {},
    });
  };


  return (
    <>
      {user && user.role==2 && <Navigate replace to="/profile" />}
      <h1>Results</h1>
      {user && results?results.map((result,index)=>{
        return (
          <>
            <div key={'room_'+index} style={{borderWidth:2,padding:10}}>
              {index+1}. {result.data_start} {result.data_end} | {result.email} | [{result.result}]
              <div>{result.description}</div>
              {user && user.role==3 && result.isRunning==1?
                <Button onClick={()=>info(result.qr_link,'Room')}>Show QR</Button>
                :
                ''
              }
            </div>
          </>
        )
      }):''}
    </>
  )
}

export default Results