import { HomeTwoTone, QqOutlined, ApiOutlined, CheckCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Layout, Flex, Menu, Button } from 'antd';
import { useState, useContext } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../context/UserContext.jsx";
import { languagePack } from '../data/language.js';

const { Content, Header, Footer } = Layout;

const login = true;

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
//  width: 'calc(50% - 8px)',
  width: '100%',
//  maxWidth: 'calc(50% - 8px)',
};

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 44,
  paddingInline: 48,
  lineHeight: '44px',
  backgroundColor: '#fff',
  padding: 0,
  paddingLeft:5,
  paddingRight:5,
};

const contentStyle = {
  textAlign: 'left',
  minHeight: 420,
  height: '100%',
  lineHeight: '12px',
  color: '#333',
  backgroundColor: '#fff',
  padding:20,
  paddingBottom:70
};

const footerStyle = {
  textAlign: 'left',
  color: '#333',
  backgroundColor: '#fff',
  borderTopColor:'#ccc',
  borderWidth:0,
  borderBottomColor:'transparent',
  borderStyle:'solid',
  borderTopWidth:2,
  padding:20,
  position: "fixed",
  bottom: 0,
  width: '100%'
};



const Routerblock = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { logout, user } = useContext(UserContext);

  const [current, setCurrent] = useState('h');
  const onClick = (e) => {
//    console.log('click ', e);
    switch(e.key){
      case 'o':
        logout()
      break;
    }
    setCurrent(e.key);
  };

//  console.log('-------------',user)

  if(user){
    const arrUsersLinks = user.folders.split(',');
//    console.log(arrUsersLinks)
  }

  return (
    <Flex gap="middle" wrap="wrap">
      {!user && <Navigate replace to="/login" />}
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal"  theme="light">
            <Menu.Item key="h" icon= {<HomeTwoTone />}>
              <Link to="/">{languagePack[lang]['HOME']}</Link>
            </Menu.Item>
            <Menu.Item key="a" icon= {<InfoCircleOutlined />}>
                  <Link to="/about">{languagePack[lang]['ABOUT']}</Link>
            </Menu.Item>
            {user?
                user.role==1?(
                  <>
                    <Menu.Item key="s" icon= {<InfoCircleOutlined />}>
                      <Link to="/students">{languagePack[lang]['STUDENTS']}</Link>
                    </Menu.Item>
                    <Menu.Item key="r" icon= {<InfoCircleOutlined />}>
                      <Link to="/rooms">{languagePack[lang]['ROOMS']}</Link>
                    </Menu.Item>
                    <Menu.Item key="qr" icon= {<InfoCircleOutlined />}>
                      <Link to="/results">{languagePack[lang]['RESULTS']}</Link>
                    </Menu.Item>
                  </>
                ):user.role==2?(
                  <>
                    <Menu.Item key="q" icon= {<InfoCircleOutlined />}>
                      <Link to="/quiz">{languagePack[lang]['QUIZ']}</Link>
                    </Menu.Item>
                    <Menu.Item key="question" icon= {<InfoCircleOutlined />}>
                      <Link to="/questions">{languagePack[lang]['QUESTIONS']}</Link>
                    </Menu.Item>
                    <Menu.Item key="stat" icon= {<InfoCircleOutlined />}>
                      <Link to="/stat">{languagePack[lang]['STATISTIC']}</Link>
                    </Menu.Item>
                  </>
                ):(
                  <>
                    <Menu.Item key="qr" icon= {<InfoCircleOutlined />}>
                      <Link to="/results">{languagePack[lang]['RESULTS']}</Link>
                    </Menu.Item>
                  </>
                )
              :''
            }
            <Menu.Item key="l" icon= {!user?<CheckCircleTwoTone />:<QqOutlined />}  style={{ marginLeft: 'auto' }}>
              {!user?
                (<Link to="/login">{languagePack[lang]['LOGIN']}</Link>):
                (<Link to="/profile">{languagePack[lang]['PROFILE']}</Link>)
              }
            </Menu.Item>
            {user &&
              <Menu.Item key="o" icon={<ApiOutlined />}>
              {languagePack[lang]['LOGOUT']}
              </Menu.Item>
            }
          </Menu>
        </Header>
        <Content style={contentStyle}>
          <Outlet/>
        </Content>
        <Footer style={footerStyle}>{languagePack[lang]['FOOTER']}</Footer>
      </Layout>
    </Flex>
   
  )

};
export default Routerblock;

/*  
  <Menu.Item key="r" icon= {<EditTwoTone />} style={{ marginLeft: 'auto' }}>
    <Link to="/register">Register</Link>
  </Menu.Item>
*/