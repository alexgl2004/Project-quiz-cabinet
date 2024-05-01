import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'
import { useOutletContext } from "react-router-dom";
import './teacher/css/student.css';

const About = () => {

  const [lang,nameAddColorCss] = useOutletContext();

  return (
    <>
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['ABOUT']}</h1>
      <div className={'bgText color'+nameAddColorCss+'Bg'}>
        
      </div>
    </>
  )
}

export default About