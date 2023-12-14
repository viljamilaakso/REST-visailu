import React, { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '', isCorrect: false });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  useEffect(() => {
    // Hae kaikki kysymykset
    fetch('http://localhost:3001/questions')
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Virhe:', error));
  }, []);

  const handleAddQuestion = () => {
    // Lisää uusi kysymys
    fetch('http://localhost:3001/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => setQuestions([...questions, data]))
      .catch((error) => console.error('Virhe:', error));
  };

  const handleAnswerClick = (questionId) => {
    // Tässä voit toteuttaa toiminnallisuuden vastaamiseen
    const selected = questions.find((q) => q.id === questionId);
    setSelectedQuestion(selected);
    setIsAnswerCorrect(null);
  };

  const handleAnswerSubmit = () => {
    // Tässä voit tarkistaa vastauksen
    const isCorrect =
      selectedQuestion && selectedQuestion.answer.toLowerCase() === answerText.toLowerCase();

    // Päivitä tilat
    setIsAnswerCorrect(isCorrect);

    // Lähetä vastaus palvelimelle
    console.log(`Vastaat kysymykseen ${selectedQuestion.id}: ${answerText}`);
    console.log(`Vastaus on ${isCorrect ? 'oikein' : 'väärin'}`);
  };

  return (
    <div>
      <h1>kysymykset</h1>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            {q.question}
            {!q.answered && (
              <button onClick={() => handleAnswerClick(q.id)}>Vastaa</button>
            )}
          </li>
        ))}
      </ul>
      {selectedQuestion && (
        <div>
          <h2>Vastaa kysymykseen</h2>
          <p>{selectedQuestion.question}</p>
          <textarea
            placeholder="Vastaus"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button onClick={handleAnswerSubmit}>Lähetä vastaus</button>
          {isAnswerCorrect !== null && (
            <p>Vastaus on {isAnswerCorrect ? 'oikein' : 'väärin'}</p>
          )}
        </div>
      )}
      <div>
        <h2>Lisää uusi kysymys</h2>
        <input
          type="text"
          placeholder="Kysymys"
          value={newQuestion.question}
          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vastaus"
          value={newQuestion.answer}
          onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
        />
        <label>
          Onko vastaus oikein?
          <input
            type="checkbox"
            checked={newQuestion.isCorrect}
            onChange={() =>
              setNewQuestion((prevQuestion) => ({
                ...prevQuestion,
                isCorrect: !prevQuestion.isCorrect,
              }))
            }
          />
        </label>
        <button onClick={handleAddQuestion}>Lisää</button>
      </div>
    </div>
  );
}

export default App;
