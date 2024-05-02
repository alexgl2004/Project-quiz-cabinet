import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'
import { useOutletContext } from "react-router-dom";
import Parser from 'html-react-parser';
import './teacher/css/student.css';

const About = () => {

  const [lang, nameAddColorCss, user] = useOutletContext();

  return (
    <>
      <h1 className={'color'+nameAddColorCss}>{languagePack[lang]['ABOUT']}</h1>
      <div className={'bgText color'+nameAddColorCss+'Bg'} style={{lineHeight:2}}>
        {user && user.role==1?
          user.role==2?
            languagePack[lang]['ABOUT_TEXT_EDITOR']
            :user.role==3?
              languagePack[lang]['ABOUT_TEXT_ALL3']
              :languagePack[lang]['ABOUT_TEXT_ALL2']
          : Parser(languagePack[lang]['ABOUT_TEXT_ALL']+
            '<br></br>'+
            languagePack[lang]['ABOUT_TEXT_ALL1']+
            '<br></br>'+
            languagePack[lang]['ABOUT_TEXT_ALL2']+
            '<br></br>'+
            languagePack[lang]['ABOUT_TEXT_ALL3'])
        }
      </div>
    </>
  )
}

export default About