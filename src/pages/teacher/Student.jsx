import dayjs from 'dayjs';
import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { PlusOutlined } from '@ant-design/icons';
import { path_server } from '../../../path.js';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Upload,
} from 'antd';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";

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

  const [lang] = useOutletContext();
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  
  const student = useRef({});
  let params = useParams();
  let userMsg_all = '';

  const [student_temp, setUsertem] = useState(null);

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }    
    
    if(user && student_temp==null){
      getStudent(params.id) 
    }

  }, [user]);

//  console.log(student_temp)

  function getStudent(student_id){
    //    console.log(students)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
      mode:'cors'
    };        

//    useEffect(() => {

    fetch(path_server+'/users/students/' + student_id, requestOptions)
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
      body: JSON.stringify(stundentData),
      mode:'cors'
    };

    fetch(path_server+'/users/students/'+params.id+'/edit', requestOptions)
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
    student.current = student_temp;
    navigate('/students')

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
      {student_temp!=null?<>
        <h1>
          {languagePack[lang]['PROFILE_OF']} {student_temp?student_temp.role==1?languagePack[lang]['TEACHER']:student_temp.role==2?languagePack[lang]['MANAGER']:languagePack[lang]['STUDENT']:''}: {student_temp.name} {student_temp.surname}
          <Link style={{fontSize:12,float:'right'}} to='/students'>{languagePack[lang]['BACK_TO_STUDENTS']}</Link>
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
          <Form.Item>
            <Button type='primary' onClick={changeUser}>{languagePack[lang]['SAVE']}</Button><span style={{color:"red",fontWeight:"bold"}}> {userMsg_all}</span>
            <Button onClick={undoChangeUser}>{languagePack[lang]['CANCEL']}</Button>
          </Form.Item>          
          <Form.Item label={languagePack[lang]['LOGIN']}>
            <b>{student_temp.login}</b>
          </Form.Item>
          <Form.Item label={languagePack[lang]['TITLE']}>
            <Radio.Group 
              name="title" 
              onChange={(e)=>{onChange(e,'title')}} 
              value={student_temp.title}
            >
              <Radio value={"Mr"}>{languagePack[lang]['MR']}</Radio>
              <Radio value={"Ms"}>{languagePack[lang]['MS']}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item 
            label={languagePack[lang]['NAME']} 
            rules={[
              {
                required: true,
                message: languagePack[lang]['ENTER_NAME'],
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
            label={languagePack[lang]['SURNAME']} 
            rules={[
              {
                required: true,
                message: languagePack[lang]['ENTER_SURNAME'],
              },
            ]}
          >
            <Input 
              name="surname" 
              onChange={(e)=>{onChange(e,'surname')}} 
              value={student_temp.surname} 
            />
          </Form.Item>
          <Form.Item label={languagePack[lang]['SCHOOL']}>
            <Input 
              name="school" 
              onChange={(e)=>{onChange(e,'school')}} 
              value={student_temp.school} 
            />
          </Form.Item>
          <Form.Item label={languagePack[lang]['BIRTHDAY']}>
            <DatePicker 
              name="birthday" 
              onChange={onChangeDatePicker} 
              value={student_temp.birthday?dayjs(student_temp.birthday, dateFormat):''}
              defaultValue={student_temp.birthday?dayjs(student_temp.birthday, dateFormat):''}
            />
          </Form.Item>
          <Form.Item 
            label={languagePack[lang]['EMAIL']} 
            rules={[
              {
                required: false,
                message: languagePack[lang]['ENTER_EMAIL'],
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
            label={languagePack[lang]['PASSWORD']}
            rules={[
              {
                required: true,
                message: languagePack[lang]['ENTER_PASSWORD'],
              },
            ]}
          >
            <Input 
              name="password" 
              onChange={(e)=>{onChange(e,'password')}} 
              value={student_temp.password} 
            />
          </Form.Item>          
        </Form>
        <div style={{color:"red",fontWeight:"bold"}}>{userMsg_all}</div>
      </>:''}
    </>
  );
};
export default () => <StudentC />;