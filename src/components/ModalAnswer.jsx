import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Button, Modal, Space } from 'antd';
import { path_server } from '../../path';
import { languagePack } from '../data/language';
const { TextArea } = Input;
import { useOutletContext } from "react-router-dom";

const ModalAnswer = (params) => {

//  console.log(params)
  const [lang] = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState([false, false]);
  const [tempNameDescription, setTempNameDescription] = useState(null);

/*
  useEffect(() => {
    console.log(params.answerContent)
    setTempNameDescription({
      answer: params.answerContent?params.answerContent.answer:"",
      comment: params.answerContent?params.answerContent.comment:"",
      correct: params.answerContent?params.answerContent.correct:"",
      question_id: params.questionId,
      id: params.answerId?params.answerId:"",
    })
  }, []); 
*/

  function editAnswer(add=0){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempNameDescription),
      mode:'cors'
    };

    fetch(path_server+'/quiz/answers/'+(add?'add':tempNameDescription.id+'/edit'), requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      params.getAnswers(data.question_id)
  
    })
  }

  function delAnswer(answerId, questionId){
    const test = confirm(languagePack[lang]['DELETE?'])
    if(test){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({del:1}),
        mode:'cors'
      };

      fetch(path_server+'/quiz/answers/' + answerId + '/delete', requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
  //      console.log(data)
        params.getAnswers(questionId)
    
      })
    }
  }  

  const onChangeND = (e,field) => {
    switch(field){
      case 'correct':
        setTempNameDescription({
          ...tempNameDescription,
          correct:(e.target.checked?1:0),
        })
      break;
      case 'answer':
        setTempNameDescription({
          ...tempNameDescription,
          answer:e.target.value,
        })
      break;
      case 'comment':
        setTempNameDescription({
          ...tempNameDescription,
          comment:e.target.value,
        })
      break;
    }
  }

  const toggleModal = (idx, target) => {
    setIsModalOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={() =>{
            toggleModal(0, true)
            setTempNameDescription({
              answer: params.answerContent?params.answerContent.answer:"",
              comment: params.answerContent?params.answerContent.comment:"",
              correct: params.answerContent?params.answerContent.correct:"",
              question_id: params.questionId,
              id: params.answerId?params.answerId:"",
            })
          }
        }>
          {params && parseInt(params.add)==1?languagePack[lang]['ADD_ANSWER']:languagePack[lang]['EDIT']}
        </Button>
        {params && parseInt(params.add)!=1?
          <Button style={{color:'#B84A5B'}} onClick={() =>{
            delAnswer(params.answerId, params.questionId)
          }
          }>
            {languagePack[lang]['DELETE_BUTTON']}
          </Button>:
          ''
        }

      </Space>
      <Modal
        title={(params.add && parseInt(params.add)==1?languagePack[lang]['ADD']:languagePack[lang]['EDIT'])+languagePack[lang]['ANSWER']}
        okText = {(params.add && parseInt(params.add)==1?languagePack[lang]['ADD']:languagePack[lang]['SAVE'])}
        cancelText = {languagePack[lang]['CANCEL']}
        open={isModalOpen[0]}
        onOk={() => {
          toggleModal(0, false)
            editAnswer(params.add && parseInt(params.add)==1?1:0)
        }}
        onCancel={() =>{
          toggleModal(0, false)
//          setTempNameDescription({})
        }}
      >
        <Form.Item label={languagePack[lang]['TEXT_OF_ANSWER']}>
          <Input 
            name="answer" 
            onChange={(e)=>{onChangeND(e,'answer')}} 
            value={tempNameDescription && tempNameDescription.answer?tempNameDescription.answer:''}
          />
        </Form.Item>
        <Form.Item label={languagePack[lang]['COMMENT']}>
          <TextArea rows={4} 
            name="comment" 
            onChange={(e)=>{onChangeND(e,'comment')}} 
            value={tempNameDescription && tempNameDescription.comment?tempNameDescription.comment:''}
          />
        </Form.Item>
        <Checkbox value="1" checked={tempNameDescription && tempNameDescription.correct?true:false} onChange={(e)=>{onChangeND(e,'correct')}}>{languagePack[lang]['IT_IS_CORRECT_ANSWER']}</Checkbox>
      </Modal>
    </>
  );
};
export default ModalAnswer;