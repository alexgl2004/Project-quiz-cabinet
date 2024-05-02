import React, { useState, useContext, useEffect } from 'react'
import { Button } from 'antd';
import { languagePack } from '../data/language'
import { useNavigate, useOutletContext } from "react-router-dom";
import './teacher/css/student.css';

const Home = () => {

  const [lang,nameAddColorCss,user] = useOutletContext();
  const navigate = useNavigate();

//  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  useEffect(() => {
//    setLang(localStorage.getItem("lang"));
  }, [lang]);

  return (
    <>
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['HOME']}</h1>
      <div className={'bgText color'+nameAddColorCss+'Bg'} style={{lineHeight:2}}>
        {languagePack[lang]['HOME_TEXT_ALL']}<br /><br />
        {user?
          <Button type="primary" htmlType="submit" onClick={()=>{navigate('/profile')}}>
            {languagePack[lang]['PROFILE']}
          </Button>
          :
          <Button type="primary" htmlType="submit" onClick={()=>{navigate('/login')}}>
            {languagePack[lang]['LOGIN']}
          </Button>
        }       
      </div>

      
    </>
  )
}

export default Home