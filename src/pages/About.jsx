import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'
import { useOutletContext } from "react-router-dom";

const About = () => {

  const [lang] = useOutletContext();

  return (
    <>
      <h1>{languagePack[lang]['ABOUT']}</h1>
    </>
  )
}

export default About