import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Button, Modal, Space } from 'antd';

const { TextArea } = Input;

const ModalAnswer = (params) => {

//  console.log(params)

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
      body: JSON.stringify(tempNameDescription)
    };

    fetch('http://192.168.2.134:3000/quiz/answers/'+(add?'add':tempNameDescription.id+'/edit'), requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
//      console.log(data)
      params.getAnswers(data.question_id)
  
    })
  }

  function delAnswer(answerId, questionId){
    const test = confirm('Are you shure to delete?')
    if(test){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({del:1})
      };

      fetch('http://192.168.2.134:3000/quiz/answers/' + answerId + '/delete', requestOptions)
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
        <Button onClick={() =>{
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
          {params && parseInt(params.add)==1?'Add answer +':'Edit'}
        </Button>
        {params && parseInt(params.add)!=1?
          <Button onClick={() =>{
            delAnswer(params.answerId, params.questionId)
          }
          }>
            Del
          </Button>:
          ''
        }

      </Space>
      <Modal
        title={(params.add && parseInt(params.add)==1?'Add':'Edit')+' answer'}
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
        <Form.Item label="Text of answer">
          <Input 
            name="answer" 
            onChange={(e)=>{onChangeND(e,'answer')}} 
            value={tempNameDescription && tempNameDescription.answer?tempNameDescription.answer:''}
          />
        </Form.Item>
        <Form.Item label="Comment">
          <TextArea rows={4} 
            name="comment" 
            onChange={(e)=>{onChangeND(e,'comment')}} 
            value={tempNameDescription && tempNameDescription.comment?tempNameDescription.comment:''}
          />
        </Form.Item>
        <Checkbox value="1" checked={tempNameDescription && tempNameDescription.correct?true:false} onChange={(e)=>{onChangeND(e,'correct')}}>It is correct answer</Checkbox>
      </Modal>
    </>
  );
};
export default ModalAnswer;