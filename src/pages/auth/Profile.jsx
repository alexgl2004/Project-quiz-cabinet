import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { PlusOutlined } from '@ant-design/icons';
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";

import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
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

const Profile = () => {

  const [lang] = useOutletContext();
  
  const { changeUserData, user, userMsg } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
  
    if(user==null){
      navigate('/login')
    }
  
  }, [user]);

  let userMsg_all = userMsg;

  const [user_temp, setUsertem] = useState({...user});

  const undoChangeUser = () => {
    setUsertem({...user});
  }

  const changeUser = () => {
    changeUserData(user_temp);
  }

//  const [value, setValue] = useState(user_temp.title);  

//  console.log(user_temp)

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

      <h1>{languagePack[lang]['PROFILE_OF']} {user?user.role==1?languagePack[lang]['TEACHER']:user.role==2?languagePack[lang]['MANAGER']:languagePack[lang]['STUDENT']:''}</h1>
      
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
        <Form.Item label={languagePack[lang]['LOGIN']}>
          <b>{user_temp.login}</b>
        </Form.Item>
        <Form.Item label={languagePack[lang]['TITLE']}>
          <Radio.Group 
            name="title" 
            onChange={(e)=>{onChange(e,'title')}} 
            value={user_temp.title}
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
            value={user_temp.name} 
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
            value={user_temp.surname} 
          />
        </Form.Item>
        <Form.Item 
          label={languagePack[lang]['SCHOOL']} 
        >
          <Input 
            name="school" 
            onChange={(e)=>{onChange(e,'school')}} 
            value={user_temp.school} 
          />
        </Form.Item>
        <Form.Item label={languagePack[lang]['BIRTHDAY']}>
          <DatePicker 
            name="birthday" 
            onChange={onChangeDatePicker} 
            value={user_temp.birthday?dayjs(user_temp.birthday, dateFormat):''}
            defaultValue={user_temp.birthday?dayjs(user_temp.birthday, dateFormat):''}
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
            value={user_temp.email}
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
            value={user_temp.password} 
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={changeUser}>{languagePack[lang]['SAVE']}</Button><span style={{color:"red",fontWeight:"bold"}}> {userMsg_all}</span>
        </Form.Item>
        <Form.Item>
          <Button onClick={undoChangeUser}>{languagePack[lang]['CANCEL']}</Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default () => <Profile />;