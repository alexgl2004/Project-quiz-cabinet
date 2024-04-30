import React, { useState, useContext, useEffect } from 'react'
import { languagePack } from '../data/language'
import { useOutletContext } from "react-router-dom";

const Home = () => {

  const [lang] = useOutletContext();

//  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  useEffect(() => {
//    setLang(localStorage.getItem("lang"));
  }, [lang]);

  return (
    <>
      <h1>{languagePack[lang]['HOME']}</h1>
    </>
  )
}

export default Home