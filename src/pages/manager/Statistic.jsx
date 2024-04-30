import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext.jsx";
import { languagePack } from '../../data/language.js';
import { useOutletContext } from "react-router-dom";

const Statistic = () => {

  const [lang] = useOutletContext();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  if(user && user.role!=2){
    navigate('/profile')
  }

  useEffect(() => {

    if(user==null){
      navigate('/login')
    }
    
  }, [user]);


  return (
    <>
      <h1>{languagePack[lang]['STATISTIC']}</h1>
    </>
  )
}

export default Statistic