import { FileDoneOutlined, OrderedListOutlined, QuestionCircleOutlined, UserOutlined, UsbOutlined, PartitionOutlined, ProjectOutlined, UsergroupAddOutlined, ReadOutlined, QqOutlined, ApiOutlined, CheckCircleTwoTone, InfoCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Flex, Menu, Button } from 'antd';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { UserContext } from "../context/UserContext.jsx";
import { languagePack } from '../data/language.js';


const { Content, Header, Footer } = Layout;

const login = true;

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
  boxShadow: '0px 5px 5px rgba(0,0,0,0.2)',
  zIndex:100,
};

  const headerInStyle = {
    width:'100%',
    maxWidth:980,
    minWidth:800,
    margin: '0 auto',
  }


const contentStyleAdd = {
  width:'100%',
  maxWidth:980,
  minWidth:800,
  minHeight: 800,
  height: '100%',
  lineHeight: '12px',
  padding:20,
  paddingBottom:70,
  textAlign: 'left',
  margin: '0 auto',
  boxShadow: '0px 10px 10px 5px rgba(0,0,0,0.1)',
  zIndex:10

}

const contentStyleBlank = {
  color: '#333',
  backgroundColor: 'RGB(255,255,255)',
  backgroundImage: 'linear-gradient(180deg, RGB(242,242,242), transparent)',
};

const contentStyleStudent = {
  backgroundColor: 'RGB(255,178,125)',
  backgroundImage: 'linear-gradient(180deg, RGB(255,204,169), transparent)',
};

const contentStyleTeacher = {
  backgroundColor: 'RGB(96,197,241)',
  backgroundImage: 'linear-gradient(180deg, RGB(148,216,246), transparent)',  
};

const contentStyleManager = {
  backgroundColor: 'RGB(152,224,173)',
  backgroundImage: 'linear-gradient(180deg, RGB(107,208,137), transparent)',  
};

const footerStyleAdd = {
  textAlign: 'right',
  borderTopColor:'#ccc',
  borderWidth:0,
  borderBottomColor:'transparent',
  borderStyle:'solid',
  borderTopWidth:0,
  padding:'21px 20px',
  position: "fixed",
  bottom: 0,
  width: '100%',
  color: '#fff',
  height: 50,
  zIndex: 5
};

const footerStyleTeacher = {
  backgroundColor: 'RGB(96,197,241)',
  backgroundImage: 'linear-gradient(180deg, RGB(0,122,174), transparent)',  
}

const footerStyleManager = {
  backgroundColor: 'RGB(107,208,137)',
  backgroundImage: 'linear-gradient(180deg, RGB(19,133,53), transparent)',  
}

const footerStyleStudent = {
  backgroundColor: 'RGB(255,178,125)',
  backgroundImage: 'linear-gradient(180deg, RGB(191,91,22), transparent)',  
}

const footerStyleBlank = {
  backgroundColor: 'RGB(242,242,242)',
  backgroundImage: 'linear-gradient(180deg, RGB(122,122,122), transparent)',  
}


const Routerblock = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { logout, user, userTheme } = useContext(UserContext);
  const navigate = useNavigate();
  
  let nameAddColorCss = '';

  switch((user?user.role:0)){
    case 1:
      nameAddColorCss = 'Blue'
    break;
    case 2:
      nameAddColorCss = 'Green'
    break;
    case 3:
      nameAddColorCss = 'Orange'
    break;
    default:
      nameAddColorCss = 'Red'
    break;
  }


  

  let contentStyle;
  let footerStyle;

  if(user && user.role){
    if(user.role==1){
      contentStyle = {...contentStyleAdd,...contentStyleTeacher}
      footerStyle = {...footerStyleAdd,...footerStyleTeacher}

      userTheme.current = {
        token: {
          // Seed Token
          colorPrimary: 'RGB(0,122,174)',
  //              borderRadius: 2,
          itemSelectedColor: 'RGB(0,122,174)',

          // Alias Token
  //              colorBgContainer: 'green',
        },
      }
    }else if(user.role==2){
      contentStyle = {...contentStyleAdd,...contentStyleManager}
      footerStyle = {...footerStyleAdd,...footerStyleManager}
      userTheme.current = {
        token: {
          // Seed Token
          colorPrimary: 'RGB(29,142,63)',
  //              borderRadius: 2,
          itemSelectedColor: 'RGB(29,142,63)',

          // Alias Token
  //              colorBgContainer: 'green',
        },
      }
    }else{
      contentStyle = {...contentStyleAdd,...contentStyleStudent}
      footerStyle = {...footerStyleAdd,...footerStyleStudent}
      userTheme.current = {
        token: {
          // Seed Token
          colorPrimary: 'RGB(191,91,22)',
  //              borderRadius: 2,
          itemSelectedColor: 'RGB(191,91,22)',

          // Alias Token
  //              colorBgContainer: 'green',
        },
      }
    }
  }else{
    contentStyle = {...contentStyleAdd,...contentStyleBlank}
    footerStyle = {...footerStyleAdd,...footerStyleBlank}
    userTheme.current = {
      token: {
        // Seed Token
        colorPrimary: 'RGB(122,122,122)',
//              borderRadius: 2,
        itemSelectedColor: 'RGB(122,122,122)',

        // Alias Token
//              colorBgContainer: 'green',
      },
    }
  }

  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
  //  width: 'calc(50% - 8px)',
    width: '50%',
    backgroundColor:userTheme.current.token.colorPrimary,
  //  maxWidth: 'calc(50% - 8px)',
  };
  
/*
  if(!user){
//    navigate('/login')
  }
*/
  useEffect(() => {
    setLang(localStorage.getItem("lang"));
  }, [lang]);

  const [current, setCurrent] = useState('h');
  const onClick = (e) => {
//    console.log('click ', e);
    switch(e.key){
      case 'langRU':
        localStorage.setItem("lang",'RU')
        setLang(localStorage.getItem("lang"));
      break;
      case 'langEN':
        localStorage.setItem("lang",'EN')
        setLang(localStorage.getItem("lang"));
      break;
      case 'langDE':
        localStorage.setItem("lang",'DE')
        setLang(localStorage.getItem("lang"));
      break;
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
    <ConfigProvider
      theme={userTheme.current}
    >

    
      <Flex gap="middle" wrap="wrap" style={{justifyContent:'center'}}>
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <div style={headerInStyle}>
              <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal"  theme="light">
                <Menu.Item key="h">
                  <Link to="/">
                    <img src="/favicon/apple-touch-icon.png" width="64" height="36" />
                  </Link>
                </Menu.Item>
                <Menu.Item key="a" icon= {<ReadOutlined />}>
                      <Link to="/about">{languagePack[lang]['ABOUT']}</Link>
                </Menu.Item>
                {user?
                    user.role==1?(
                      <>
                        <Menu.Item key="s" icon= {<UsergroupAddOutlined />}>
                          <Link to="/students">{languagePack[lang]['STUDENTS']}</Link>
                        </Menu.Item>
                        <Menu.Item key="r" icon= {<PartitionOutlined />}>
                          <Link to="/rooms">{languagePack[lang]['ROOMS']}</Link>
                        </Menu.Item>
                        <Menu.Item key="qr" icon= {<ProjectOutlined />}>
                          <Link to="/results">{languagePack[lang]['RESULTS']}</Link>
                        </Menu.Item>
                      </>
                    ):user.role==2?(
                      <>
                        <Menu.Item key="q" icon= {<OrderedListOutlined />}>
                          <Link to="/quiz">{languagePack[lang]['QUIZZES']}</Link>
                        </Menu.Item>
                        <Menu.Item key="question" icon= {<QuestionCircleOutlined />}>
                          <Link to="/questions">{languagePack[lang]['QUESTIONS']}</Link>
                        </Menu.Item>
                        {user.role==4?
                          <Menu.Item key="stat" icon= {<FileDoneOutlined />}>
                            <Link to="/stat">{languagePack[lang]['STATISTIC']}</Link>
                          </Menu.Item>:
                          ''
                        }
                      </>
                    ):(
                      <>
                        <Menu.Item key="qr" icon= {<ProjectOutlined />}>
                          <Link to="/results">{languagePack[lang]['RESULTS']}</Link>
                        </Menu.Item>
                      </>
                    )
                  :''
                }
                <Menu.Item key="l" icon= {!user?<UsbOutlined />:<UserOutlined />}  style={{ marginLeft:'auto', marginRight: 20, padding: 0 }}>
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
                {['DE','EN','RU'].map((elem)=>{
                  return <Menu.Item key={"lang"+elem} style={{backgroundColor:(lang==elem?userTheme.current.token.colorPrimary:'white'), color:(lang==elem?'white':'grey'),marginLeft: 1, padding: '0 5px', fontWeight: 'bold' }}>
                    {elem}
                  </Menu.Item>
                })}
              </Menu>
            </div>
          </Header>
          <Content style={contentStyle}>
            <Outlet context={[lang,nameAddColorCss,user]} />
          </Content>
          <Footer style={footerStyle}>{languagePack[lang]['FOOTER']}</Footer>
        </Layout>
      </Flex>
    </ConfigProvider> 
  )

};
export default Routerblock;

/*  
  <Menu.Item key="r" icon= {<EditTwoTone />} style={{ marginLeft: 'auto' }}>
    <Link to="/register">Register</Link>
  </Menu.Item>
*/