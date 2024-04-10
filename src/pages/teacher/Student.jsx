import dayjs from 'dayjs';
import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { PlusOutlined } from '@ant-design/icons';

import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const StudentC = () => {
  
  const { user } = useContext(UserContext);
  const student = useRef({});
  let params = useParams();
  let userMsg_all = '';

  const [student_temp, setUsertem] = useState(null);

  useEffect(() => {
    if(student_temp==null){
      getStudent(params.id) 
    }
  })  

//  console.log(student_temp)

  function getStudent(student_id){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    };        

//    useEffect(() => {

    fetch('http://localhost:3000/users/students/' + student_id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data.studentData){
        student.current = data.studentData
        setUsertem({...student.current})
//          setMsg(data.msg)
      }else{
//          setMsg(data.msg)
      }
//      console.log(data);
    });
//    }, [user]);
  }

  function changeStundentData(stundentData){

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stundentData)
    };

    fetch('http://localhost:3000/users/students/'+params.id+'/edit', requestOptions)
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
//        setMsg(data.msg)
      }else{
//            console.log(data.msg)
//        setMsg(data.msg)
      }
//          console.log(data);

    });    

  }
      

  const undoChangeUser = () => {
    setUsertem({...student.current});
  }

  const changeUser = () => {
    changeStundentData(student_temp);
    student.current = student_temp
  }

//  const [value, setValue] = useState(student_temp.title);  

//  console.log(student_temp)

  const onChange = (e,name) => {
    switch(name){
      case 'email':
        setUsertem((prev)=>{
          return {
            ...prev,
            email: e.target.value,
          }
        });
      break;
      case 'password':
        setUsertem((prev)=>{
          return {
            ...prev,
            password: e.target.value,
          }
        });
      break;
      case 'title':
        setUsertem((prev)=>{
          return {
            ...prev,
            title: e.target.value,
          }
        });
      break;
      case 'name':
        setUsertem((prev)=>{
          return {
            ...prev,
            name: e.target.value,
          }
        });
      break;
      case 'surname':
        setUsertem((prev)=>{
          return {
            ...prev,
            surname: e.target.value,
          }
        });
      break;
      case 'school':
        setUsertem((prev)=>{
          return {
            ...prev,
            school: e.target.value,
          }
        });
      break;
    }
  }

  const onChangeDatePicker = (_, dateStr) => {
      setUsertem((prev)=>{
        return {
          ...prev,
          birthday: dateStr,
        }
      });
   }
 
  return (
    <>
      {!user && <Navigate replace to="/login" />}
      {student_temp!=null?<>
        <h1>
          Profile of {student_temp?student_temp.role==1?'teacher':student_temp.role==2?'manager':'student':''}: {student_temp.name} {student_temp.surname}
          <Link style={{fontSize:12,float:'right'}} to='/students'>Back to students</Link>
        </h1>
        
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"

          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Title">
            <Radio.Group 
              name="title" 
              onChange={(e)=>{onChange(e,'title')}} 
              value={student_temp.title}
            >
              <Radio value={"Mr"}>Mr</Radio>
              <Radio value={"Ms"}>Ms</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item 
            label="Name" 
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input 
              name="name" 
              onChange={(e)=>{onChange(e,'name')}} 
              value={student_temp.name} 
            />
          </Form.Item>
          <Form.Item 
            label="Surname" 
            rules={[
              {
                required: true,
                message: 'Please input your surname!',
              },
            ]}
          >
            <Input 
              name="surname" 
              onChange={(e)=>{onChange(e,'surname')}} 
              value={student_temp.surname} 
            />
          </Form.Item>
          <Form.Item 
            label="School" 
            rules={[
              {
                required: true,
                message: 'Please input your school!',
              },
            ]}
          >
            <Input 
              name="school" 
              onChange={(e)=>{onChange(e,'school')}} 
              value={student_temp.school} 
            />
          </Form.Item>
          <Form.Item label="Birthday">
            <DatePicker 
              name="birthday" 
              onChange={onChangeDatePicker} 
              value={student_temp.birthday?dayjs(student_temp.birthday, dateFormat):''}
              defaultValue={student_temp.birthday?dayjs(student_temp.birthday, dateFormat):''}
            />
          </Form.Item>
          <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{
                  border: 0,
                  background: 'none',
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item 
            label="email" 
            rules={[
              {
                required: false,
                message: 'Please input your school!',
              },
            ]}
          >
            <Input 
              name="email" 
              onChange={(e)=>{onChange(e,'email')}} 
              value={student_temp.email}
            />
          </Form.Item>
          <Form.Item 
            label="password" 
            rules={[
              {
                required: true,
                message: 'Please input your school!',
              },
            ]}
          >
            <Input 
              name="password" 
              onChange={(e)=>{onChange(e,'password')}} 
              value={student_temp.password} 
            />
          </Form.Item>          
          <Form.Item>
            <Button onClick={changeUser}>Save</Button><span style={{color:"red",fontWeight:"bold"}}> {userMsg_all}</span>
          </Form.Item>
          <Form.Item>
            <Button onClick={undoChangeUser}>Cancel</Button>
          </Form.Item>
        </Form>
        <div style={{color:"red",fontWeight:"bold"}}>{userMsg_all}</div>
      </>:''}
    </>
  );
};
export default () => <StudentC />;