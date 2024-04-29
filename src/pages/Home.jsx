import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'

const Home = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  return (
    <>
      <h1>{languagePack[lang]['HOME']}</h1>
    </>
  )
}

export default Home