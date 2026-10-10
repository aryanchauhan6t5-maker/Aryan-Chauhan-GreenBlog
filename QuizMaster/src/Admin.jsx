
import { useEffect, useState } from "react";

const API = "http://localhost:8080";

const emptyForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: "",
};

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/admin/questions`);

      if (!response.ok) {
        throw new Error("Could not load admin questions.");
      }

      setQuestions(await response.json());
    } catch (err) {
      setError(
        "Unable to load questions. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !form.question.trim() ||
      !form.optionA.trim() ||
      !form.optionB.trim() ||
      !form.optionC.trim() ||
      !form.optionD.trim() ||
      !form.answer
    ) {
      setError("Please complete every field.");
      return;
    }

    if (
      ![
        form.optionA,
        form.optionB,
        form.optionC,
        form.optionD,
      ].includes(form.answer)
    ) {
      setError("The correct answer must match one of the four options.");
      return;
    }

    setSaving(true);

    try {
      const editing = editingId !== null;
      const url = editing
        ? `${API}/api/questions/${editingId}`
        : `${API}/api/questions`;

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(
          `Could not ${editing ? "update" : "add"} the question.`
        );
      }

      setMessage(editing ? "Question updated successfully." : "Question added successfully.");
      setForm(emptyForm);
      setEditingId(null);
      await loadQuestions();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(question) {
    setEditingId(question.id);
    setForm({
      question: question.question || "",
      optionA: question.optionA || "",
      optionB: question.optionB || "",
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      answer: question.answer || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function deleteQuestion(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete the question.");
      }

      setQuestions((previous) =>
        previous.filter((question) => question.id !== id)
      );

      if (editingId === id) {
        cancelEditing();
      }

      setMessage("Question deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <section className="admin-section">
      <div className="hero admin-hero">
        <span className="eyebrow">QUESTION MANAGEMENT</span>
        <h1>Admin Panel</h1>
        <p>Add new questions or manage your existing quiz questions.</p>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form className="panel admin-form" onSubmit={handleSubmit}>
        <h2>{editingId !== null ? "Edit Question" : "Add a Question"}</h2>

        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="Enter the question"
          rows="3"
          required
        />

        <div className="admin-fields">
          {["optionA", "optionB", "optionC", "optionD"].map(
            (field, index) => (
              <div className="field" key={field}>
                <label htmlFor={field}>Option {String.fromCharCode(65 + index)}</label>
                <input
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                  required
                />
              </div>
            )
          )}
        </div>

        <label htmlFor="answer">Correct Answer</label>
        <select
          id="answer"
          name="answer"
          value={form.answer}
          onChange={handleChange}
          required
        >
          <option value="">Select the correct option</option>
          {[form.optionA, form.optionB, form.optionC, form.optionD]
            .filter((option) => option.trim() !== "")
            .map((option, index) => (
              <option value={option} key={`${option}-${index}`}>
                {String.fromCharCode(65 + index)} — {option}
              </option>
            ))}
        </select>

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Update Question"
                : "Add Question"}
          </button>

          {editingId !== null && (
            <button
              className="secondary-button"
              type="button"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list-heading">
        <h2>Existing Questions</h2>
        <span className="question-count">{questions.length} Total</span>
      </div>

      {loading ? (
        <div className="panel status">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="panel status">No questions found. Add one above.</div>
      ) : (
        questions.map((question, index) => (
          <article className="panel admin-question" key={question.id}>
            <div className="question-number">
              Question {index + 1} · ID {question.id}
            </div>

            <h3>{question.question}</h3>

            <div className="admin-options">
              <p>A. {question.optionA}</p>
              <p>B. {question.optionB}</p>
              <p>C. {question.optionC}</p>
              <p>D. {question.optionD}</p>
            </div>

            <p className="correct-answer">
              Correct answer: <strong>{question.answer}</strong>
            </p>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={() => startEditing(question)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteQuestion(question.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

export default Admin;
