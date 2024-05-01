import { useState, useContext, React} from 'react'

import { Button, Checkbox, Form, Input } from 'antd';
//import { Redirect } from 'react-router';
import { Navigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";
import '../teacher/css/student.css';

const Login = () => {

  const [lang,nameAddColorCss] = useOutletContext();

  const { logout, login, user, userMsg } = useContext(UserContext);

  let userMsg_all = userMsg;

  const [nameUser, setName] = useState("");
  const [passwordUser, setPassword] = useState("");

  const onFinish = (values) => {
    console.log('params: ', values);
    login(values.username, values.password)
    if(user){
      console.log('success: ',userMsg_all)
    }else{
      console.log('error: ',userMsg_all)
    }              
  };

  const onFinishFailed = (errorInfo) => {
    userMsg_all = userMsg + errorInfo
//    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {user && <Navigate replace to="/profile" />}
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['LOGIN']}</h1>
      <div className={'bgText color'+nameAddColorCss+'Bg'} style={{
        margin:'50px 160px', 
        width:600,
        padding: '60px 60px 30px 0px', 
        borderRadius: 10
      }}>
        <div className='form-Login-In'>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={languagePack[lang]['USERNAME']}
            name="username"
            rules={[
              {
                required: true,
                message: languagePack[lang]['ENTER_USERNAME']
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={languagePack[lang]['PASSWORD']}
            name="password"
            rules={[
              {
                required: true,
                message: languagePack[lang]['ENTER_PASSWORD'],
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {languagePack[lang]['SUBMIT']}
            </Button>
          </Form.Item>
        </Form>
          <div style={{color:"red",fontWeight:"bold"}}>{userMsg_all}</div>
        </div>
      </div>
    </>

  )
}

export default Login