import { useState, useContext, React} from 'react'

import { Button, Checkbox, Form, Input } from 'antd';
//import { Redirect } from 'react-router';
import { Navigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";

const Login = () => {

  const { logout, login, user, userMsg } = useContext(UserContext);

  const [nameUser, setName] = useState("");
  const [passwordUser, setPassword] = useState("");

  const onFinish = (values) => {
    console.log('params: ', values);
    login(values.username, values.password)
    if(user){
      console.log('success: ',userMsg)
    }else{
      console.log('error: ',userMsg)
    }              
  };

  const onFinishFailed = (errorInfo) => {
    alert('Failed:', errorInfo)
//    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {user && <Navigate replace to="/profile" />}
      <h1>Login</h1>
      <div className='form-Login'>
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
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
              Submit
            </Button>
          </Form.Item>
        </Form>          
        </div>
      </div>
    </>

  )
}

export default Login