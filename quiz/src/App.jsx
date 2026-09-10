import { useState, useEffect } from 'react'
import './App.css'
import questions from './data/quiz.json'

const TIME = 60

function App()
{
  console.log(questions)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])
  const [timeLeft, setTimeLeft] = useState(TIME)

  useEffect(() =>
  {
    if (!quizStarted || quizFinished || selectedAnswer !== null)
    {
      return
    }

    const timer = setTimeout(() =>
    {
      if (timeLeft > 1)
      {
        setTimeLeft(timeLeft - 1)
      }
      else
      {
        const current = questions.questions[currentQuestion]

        const result =
            {
              question: current.question,
              selectedAnswer: "Tempo scaduto; nessuna risposta",
              correctAnswer: current.options[current.correct_answer_index],
              isCorrect: false
            }

        setResults(results => [...results, result])
        setScore(score => score - 1)

        if (currentQuestion === questions.questions.length - 1)
        {
          setQuizFinished(true)
        }
        else
        {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setTimeLeft(TIME)
        }
      }
    }, 1000)

    return () =>
    {
      clearTimeout(timer)
    }
  }, [quizStarted, quizFinished, selectedAnswer, currentQuestion, timeLeft])

  function handleAnswer(index)
  {
    const current = questions.questions[currentQuestion]

    const result =
        {
          question: current.question,
          selectedAnswer: current.options[index],
          correctAnswer: current.options[current.correct_answer_index],
          isCorrect: index === current.correct_answer_index
        }

    setResults(results => [...results, result])
    setSelectedAnswer(index)

    if (index === current.correct_answer_index)
    {
      console.log("Corretta!")
      setScore(score => score + 1)
    }
    else
    {
      console.log("Sbagliata!")
    }
  }

  function nextQuestion()
  {
    if (selectedAnswer === null)
    {
      const current = questions.questions[currentQuestion]

      const result =
          {
            question: current.question,
            selectedAnswer: "Domanda saltata; nessuna risposta",
            correctAnswer: current.options[current.correct_answer_index],
            isCorrect: false
          }

      setResults(results => [...results, result])
    }

    if (currentQuestion === questions.questions.length - 1)
    {
      setQuizFinished(true)
    }
    else
    {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(TIME)
    }
  }

  function restartQuiz()
  {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setResults([])
    setTimeLeft(TIME)
    setQuizFinished(false)
    setQuizStarted(true)
  }

  return (
      <>
        <section id="center">

          {!quizStarted ? (
              <div>
                <h1>{questions.quiz_title}</h1>
                <div className="rules">
                  <h3>Regole del gioco</h3>

                  <p>Ogni risposta esatta vale <strong>1 punto</strong>.</p>
                  <p>Ogni risposta saltata o sbagliata vale <strong>0 punti</strong>.</p>
                  <p>Far scadere il tempo comporta un malus di <strong>-1 punto</strong>.</p>
                </div>

                <button type="button" className="start-button" onClick={() =>
                {
                  setQuizStarted(true)
                  setQuizFinished(false)
                  setSelectedAnswer(null)
                  setTimeLeft(TIME)
                }}>
                  INIZIA!
                </button>
              </div>
          ) : quizFinished ? (
              <div className="results-card">
                <h1>Quiz terminato!</h1>

                <p className="final-score">
                  {score} / {questions.questions.length}
                </p>

                <p>Questo è il tuo risultato!</p>

                <button type="button" className="restart-button" onClick={restartQuiz}>
                  RICOMINCIA
                </button>

                <div className="results-list">
                  {results.map((result, index) => (
                      <div className="result-item" key={index}>
                        <h3>Domanda {index + 1}</h3>

                        <p>{result.question}</p>

                        <p>
                          La tua risposta: <strong>{result.selectedAnswer}</strong>
                        </p>

                        <p>
                          Risposta corretta: <strong>{result.correctAnswer}</strong>
                        </p>
                      </div>
                  ))}
                </div>
              </div>
          ) : (
              <div className="quiz-card">

                <div className="quiz-header">
                  <h1>{questions.quiz_title}</h1>
                  <p>Domanda {currentQuestion + 1} di {questions.questions.length}</p>
                </div>

                <div className="question-card">
                  <h2>{questions.questions[currentQuestion].question}</h2>

                  <div className="answers">
                    {questions.questions[currentQuestion].options.map((option, index) => (
                        <button key={index}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleAnswer(index)}
                                className={ selectedAnswer !== null
                                    ? (index === questions.questions[currentQuestion].correct_answer_index
                                        ? "correct" : selectedAnswer === index ? "wrong" : "") : "" }>
                          {option}
                        </button>
                    ))}
                  </div>
                </div>

                {selectedAnswer !== null && (
                    <p className="explanation">
                      {questions.questions[currentQuestion].explanation}
                    </p>
                )}

                <div className="quiz-footer">
                  <p>Tempo rimasto: {timeLeft}</p>

                  <button type="button" className="counter"
                          onClick={nextQuestion}
                  >
                    AVANTI
                  </button>
                </div>

              </div>
          )}

        </section>
      </>
  )
}

export default App
