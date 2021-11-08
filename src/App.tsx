// eslint-disable

import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// components
import QuestionCard from './components/QuestionCard';
// types
import { QuestionState, Difficulty } from './API';
// styles
import { Footer, GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY));
  

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);

    console.log(newQuestions);
    
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver)  {
      
      // Users answer
      const answer = e.currentTarget.value;
      // check answer
      const correct = questions[number].correct_answer === answer;
      
      // update score when ans correct
      if(correct)   setScore(prev => prev + 1)

      // Save answer in array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject])
      
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS+1) {
      setGameOver(true);
    }
    else {
      setNumber(nextQuestion);
    }
  }

  return (
        <>
          <GlobalStyle />
          <Wrapper>
            <h1>General Knowledge Quiz</h1>
            {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
              <button className='start' onClick={startQuiz}>
                Start
              </button>
            ) : null}
            
            {!gameOver ? <p className='score'>Score: {score}</p> : null}
            {loading && <p>Loading Questions...</p>}
            
            {!loading && !gameOver && (
              <QuestionCard
                questionNumber = {number + 1}
                totalQuestions = {TOTAL_QUESTIONS}
                question = {questions[number].question}
                answers = {questions[number].answers}
                userAnswer = {userAnswers ? userAnswers[number] : undefined}
                callback = {checkAnswer}
              />
            )}
            
            {!gameOver && !loading && userAnswers.length === number+1 && number !== TOTAL_QUESTIONS-1 ? (
                <button className='next' onClick={nextQuestion}>
                  Next Question
                </button>
            ) : null}
            
          </Wrapper>
          <Footer>
              Made with 💙 by <a href="https://www.linkedin.com/in/abhyansh-agrahari/">Abhyansh Agrahari</a>
          </Footer>
        </>
  );
}

export default App;
