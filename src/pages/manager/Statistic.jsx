import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { languagePack } from '../../data/language.js';

const Statistic = () => {

  const [ lang, setLang] = useState(localStorage.getItem("lang"));

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  if(user && user.role!=2){
    navigate('/profile')
  }

  return (
    <>
      <h1>{languagePack[lang]['STATISTIC']}</h1>
    </>
  )
}

export default Statistic