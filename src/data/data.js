export const test_questions = {
  questions: [
    {
      id: 1,
      question: {
        text: "How do you select an element with id=demo?",
        points_right: 10,
      },
      answers: [
        {
          number: 1,
          text: "#demo",
          correct: true,
        },
        {
          number: 2,
          text: ".demo",
          correct: false,
        },
        {
          number: 3,
          text: "Demo",
          correct: false,
        },
        {
          number: 4,
          text: "*demo",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      question: {
        text: "What does CSS stand for?",
        points_right: 10,
      },
      answers: [
        {
          number: 1,
          text: "Computer Style Sheets",
          correct: false,
        },
        {
          number: 2,
          text: "Cascading Style Sheets",
          correct: true,
        },
        {
          number: 3,
          text: "Colored Style Sheets",
          correct: false,
        },
        {
          number: 4,
          text: "Creative Style Sheets",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      question: {
        text: "Which CSS syntax is correct?",
        points_right: 10,
      },
      answers: [
        {
          number: 1,
          text: "{body: color=black;}",
          correct: false,
        },
        {
          number: 2,
          text: "{body; color=black;}",
          correct: false,
        },
        {
          number: 3,
          text: "body {color: black;}",
          correct: true,
        },
        {
          number: 4,
          text: "body: color=black;",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      question: {
        text: "What is the default value for position?",
        points_right: 10,
      },
      answers: [
        {
          number: 1,
          text: "relative",
          correct: false,
        },
        {
          number: 2,
          text: "fixed",
          correct: false,
        },
        {
          number: 3,
          text: "absolute",
          correct: false,
        },
        {
          number: 4,
          text: "static",
          correct: true,
        },
      ],
    },
    {
      id: 5,
      question: {
        text: "What is HTML?",
        points_right: 10,
      },
      answers: [
        {
          number: 1,
          text: "HTML",
          correct: false,
        },
        {
          number: 2,
          text: "Hyper Dancing with a Lamp",
          correct: false,
        },
        {
          number: 3,
          text: "Hyper Text Markup Language",
          correct: true,
        },
        {
          number: 4,
          text: "Higher Tone Muted Lighter",
          correct: false,
        }
      ],
    },
  ],
};
