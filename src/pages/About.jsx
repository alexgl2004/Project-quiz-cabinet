import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'

const About = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  return (
    <>
      <h1>{languagePack[lang]['ABOUT']}</h1>
    </>
  )
}

export default About