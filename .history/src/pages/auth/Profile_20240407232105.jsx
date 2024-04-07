import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
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

const FormDisabledDemo = () => {
  
  const { changeUserData, user, userMsg } = useContext(UserContext);

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

      <h1>Profile: {user?user.role==1?'teacher':'manager':''}</h1>
      
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
            value={user_temp.title}
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
            value={user_temp.name} 
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
            value={user_temp.surname} 
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
            value={user_temp.school} 
          />
        </Form.Item>
        <Form.Item label="Birthday">
          <DatePicker 
            name="birthday" 
            onChange={onChangeDatePicker} 
            value={dayjs(user_temp.birthday, dateFormat)} 
            defaultValue={dayjs(user_temp.birthday, dateFormat)} 
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
        <Form.Item>
          <Button onClick={changeUser}>Save</Button><span style={{color:"red",fontWeight:"bold"}}> {userMsg_all}</span>
        <Form.Item>
          <Button onClick={undoChangeUser}>Cancel</Button>
        </Form.Item>
      </Form>
      <div style={{color:"red",fontWeight:"bold"}}>{userMsg_all}</div>
    </>
  );
};
export default () => <FormDisabledDemo />;