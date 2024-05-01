import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'
import { useOutletContext } from "react-router-dom";
import './teacher/css/student.css';

const Home = () => {

  const [lang,nameAddColorCss] = useOutletContext();

//  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  useEffect(() => {
//    setLang(localStorage.getItem("lang"));
  }, [lang]);

  return (
    <>
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['HOME']}</h1>
      <div className={'bgText color'+nameAddColorCss+'Bg'}>
        
      </div>
    </>
  )
}

export default Home