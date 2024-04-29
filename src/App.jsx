import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import { UserProvider } from "./context/UserContext.jsx";
import { TeacherProvider } from "./context/TeacherContext.jsx";

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Profile from './pages/auth/Profile.jsx';

import Students from './pages/teacher/Students.jsx';
import Student from './pages/teacher/Student.jsx';
import Rooms from './pages/teacher/Rooms.jsx';
import Room from './pages/teacher/Room.jsx';
import Results from './pages/teacher/Results.jsx';

import Quiz from './pages/manager/Quiz.jsx';
import Quizes from './pages/manager/Quizes.jsx';

import Questions from './pages/manager/Questions.jsx';
import Statistic from './pages/manager/Statistic.jsx';

import Routerblock from './components/Routerblock.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Routerblock />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
      <Route path="about" element={<About />} />

      <Route path="students/:id" element={<Student />} />
      <Route path="students" element={<Students />} />
      <Route path="rooms/:id" element={<Room />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="results" element={<Results />} />

      <Route path="quiz/:id" element={<Quiz />} />
      <Route path="quiz" element={<Quizes />} />
      <Route path="questions" element={<Questions />} />
      <Route path="stat" element={<Statistic />} />
    </Route>
  )
)

function App({routers}) {

  localStorage.setItem("lang","EN");
  const lang = localStorage.getItem("lang");
//  console.log(lang)

  if(!lang) localStorage.setItem("lang","EN");

  return (
    <UserProvider>
      <TeacherProvider>
        <RouterProvider router={router}/>
      </TeacherProvider>
    </UserProvider>
  );
}

export default App;
