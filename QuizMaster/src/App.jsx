
import { useEffect, useState } from "react";
import Admin from "./Admin";
import "./App.css";

const API = "http://localhost:8080";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/questions`);

      if (!response.ok) {
        throw new Error("Could not load questions.");
      }

      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(
        "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function selectAnswer(questionId, selectedAnswer) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: selectedAnswer,
    }));
  }

  async function submitQuiz() {
    if (questions.length === 0) {
      setError("There are no questions available.");
      return;
    }

    const unanswered = questions.some(
      (question) => !answers[question.id]
    );

    if (unanswered) {
      setError("Please answer every question before submitting.");
      return;
    }

    try {
      setError("");

      const submission = questions.map((question) => ({
        questionId: question.id,
        selectedAnswer: answers[question.id],
      }));

      const response = await fetch(`${API}/api/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Quiz submission failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not submit your quiz.");
    }
  }

  function restartQuiz() {
    setAnswers({});
    setResult(null);
    setError("");
    loadQuestions();
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">Q</span>
          <span>QuizMaster</span>
        </div>

        <button
          className="secondary-button"
          onClick={() => {
            setShowAdmin((previous) => !previous);
            setError("");
          }}
        >
          {showAdmin ? "Back to Quiz" : "Admin Panel"}
        </button>
      </header>

      <main className="main-container">
        {showAdmin ? (
          <Admin />
        ) : (
          <>
            <section className="hero">
              <span className="eyebrow">LEARN · PRACTICE · IMPROVE</span>
              <h1>Test your knowledge.</h1>
              <p>
                Challenge yourself with questions and see how much you know.
              </p>
            </section>

            {error && <div className="message error">{error}</div>}

            {loading ? (
              <div className="panel status">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="panel status">
                <h2>No questions available</h2>
                <p>Add questions using the Admin Panel.</p>
                <button
                  className="primary-button"
                  onClick={() => setShowAdmin(true)}
                >
                  Open Admin Panel
                </button>
              </div>
            ) : result ? (
              <section className="panel result-panel">
                <div className="result-icon">✓</div>
                <h2>Quiz completed!</h2>

                <div className="score">
                  {result.score}
                  <span> / {result.totalQuestions}</span>
                </div>

                <p className="muted">Your final score</p>

                <div className="review-heading">
                  <h3>Answer review</h3>
                </div>

                {result.review?.map((item, index) => {
                  const question = questions.find(
                    (q) => q.id === item.questionId
                  );

                  return (
                    <div
                      className="review-item"
                      key={`${item.questionId}-${index}`}
                    >
                      <h4>
                        {index + 1}.{" "}
                        {question?.question || `Question ${item.questionId}`}
                      </h4>

                      <p>
                        Your answer:{" "}
                        <strong>{item.selectedAnswer || "Not answered"}</strong>
                      </p>

                      <p>
                        Correct answer:{" "}
                        <strong>{item.correctAnswer}</strong>
                      </p>

                      <span
                        className={
                          item.correct ? "status-tag correct" : "status-tag wrong"
                        }
                      >
                        {item.correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  );
                })}

                <button className="primary-button" onClick={restartQuiz}>
                  Try Again
                </button>
              </section>
            ) : (
              <section className="quiz-section">
                <div className="quiz-heading">
                  <div>
                    <h2>Your Quiz</h2>
                    <p className="muted">
                      Select one answer for each question.
                    </p>
                  </div>
                  <span className="question-count">
                    {questions.length} Questions
                  </span>
                </div>

                {questions.map((question, index) => {
                  const options = [
                    question.optionA,
                    question.optionB,
                    question.optionC,
                    question.optionD,
                  ].filter((option) => option != null && option !== "");

                  return (
                    <article className="panel question-card" key={question.id}>
                      <div className="question-number">
                        Question {index + 1} of {questions.length}
                      </div>

                      <h3>{question.question}</h3>

                      <div className="options">
                        {options.map((option, optionIndex) => (
                          <button
                            key={`${question.id}-${optionIndex}`}
                            className={`option ${
                              answers[question.id] === option ? "selected" : ""
                            }`}
                            onClick={() =>
                              selectAnswer(question.id, option)
                            }
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </article>
                  );
                })}

                <div className="submit-row">
                  <span className="muted">
                    Answered {Object.keys(answers).length} of {questions.length}
                  </span>

                  <button
                    className="primary-button"
                    onClick={submitQuiz}
                    disabled={loading}
                  >
                    Submit Quiz
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        QuizMaster · Keep learning, keep growing.
      </footer>
    </div>
  );
}

export default App;
