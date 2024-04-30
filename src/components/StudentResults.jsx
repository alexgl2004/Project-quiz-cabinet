import React, { useState, useRef, useContext, useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import QRCode from "react-qr-code";
import { Button, Modal, Space } from 'antd';
import { path_server } from '../../path';
import { languagePack } from '../data/language';

const StudentResults = (params) => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));
  const [results, setResults] = useState(null);

  useEffect(() => {
    getResults()
  }, []);

  function getResults(){

//    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: params.userId }),
      mode:'cors'
    };

    fetch(
      path_server+'/users/results/student',
      requestOptions
    )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//          console.log(data)
      if(data.resultsData){
        setResults({
          resultsData: data.resultsData,
          resultsQuestion: data.resultsQuestion,
        })
      }else{
//            console.log(data.msg)
      }

//          console.log(data);

    });

  } 
  
  let info

  if(params.oneUser){
    info = (value,name) => {
      Modal.info({
        title: languagePack[lang]['QR_CODE_FOR'] + ' ' + name,
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
  }

//  console.log(results)

  return (
    <>
      {params.userId && results && results.resultsData?results.resultsData.map((result,index)=>{
        return (
          <div key={'room_'+index} style={{flexWrap:'wrap',borderWidth:2,display:'flex',border:'1px solid #ccc',borderRadius:10,marginBottom:5,padding:20,padding:5,backgroundColor:'#fff'}}>
            {!params.oneUser?
              <h3 style={{width:'100%',color:'brown'}}>{languagePack[lang]['STUDENT']}: {params.firstname} {params.lastname}</h3>:''
            }
            <div style={{width:'50%'}}>
              <h4>{index+1}. {result.name}</h4>
              <div>{result.description}</div>
            </div>
            <div style={{width:'30%'}}>
              <div style={{marginTop:(result.finished?-10:10)}}>{languagePack[lang]['START_AT']}: <b>{result.date_start}</b></div>
              {result.finished?
                <div style={{marginTop:15}}>{languagePack[lang]['FINISH_AT']}: <b>{result.date_end}</b></div>:''
              }
            </div>
            <div style={{width:'20%'}}>
              {params.oneUser && result.isRunning==1 && result.finished!=1?
                <Button onClick={()=>info(result.qr_link,'Room')}>{languagePack[lang]['SHOW_QR']}</Button>
                :
                ''
              }
              <small style={{fontSize:14}}>{result.finished?languagePack[lang]['TEST_FINISHED']:''}</small>
            </div>
            {result.show_results==1?
              <div style={{width:'100%',borderTop:'1px solid #ccc',padding:5,backgroundColor:'#fff'}}>
                <h6>{languagePack[lang]['RESULTS']}</h6>
                <div style={{display:'flex'}}>
                  {results.resultsQuestion.filter((elem)=>{
                      return elem.result_id == result.id
                    }).map((elem,index)=>{
                        return (
                          <div key={elem.id+'_'+elem.quiz_id+'_'+elem.question_id} style={{borderRadius:5,marginRight:5,border:'1px solid #ccc',padding:10,backgroundColor:(elem.correct?'#6BD089':'#F47378')}}>
                            <div style={{marginBottom:10,fontWeight:'bold',color:'white',width:'100%',textAlign:'center'}}>{index+1}</div>
                            <div style={{marginTop:10,fontWeight:'bold',fontSize:20,width:'100%',textAlign:'center'}}>{elem.correct?elem.points:'0'}</div>
                          </div>
                        )
                    })
                  }
                  <div style={{borderRadius:5,marginRight:5,border:'2px solid '+(result.result>0 && (result.max_points/result.result) < 2?'#6BD089':'#F47378'),padding:10}}>
                    <div style={{marginBottom:10,fontWeight:'bold',color:(result.result>0 && (result.max_points/result.result) < 2?'#6BD089':'#F47378'),width:'100%',textAlign:'center'}}>{languagePack[lang]['YOUR_RESULT']}</div>
                    <div style={{marginTop:10,fontWeight:'bold',fontSize:20,width:'100%',textAlign:'center'}}>{result.result} / {result.max_points}</div>
                  </div>
                </div>
                
              </div>
            :''}
          </div>
        )
      }):''}
    </>
  )
}

export default StudentResults