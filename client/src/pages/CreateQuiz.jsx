import React from 'react' // Add this import
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Utility for unique IDs
const generateId = () => crypto.randomUUID?.() || Date.now().toString();

const DEFAULT_OPTION_COUNT = 4;

const defaultQuestion = (id = generateId()) => ({
  id,
  text: '',
  type: 'multiple-choice',
  options: Array(DEFAULT_OPTION_COUNT).fill(''),
  correctAnswer: 0
});

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [defaultQuestion()]
  });

  // Add a new question
  const addQuestion = useCallback(() => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, defaultQuestion()]
    }));
  }, []);

  // Update any field of a question
  const updateQuestion = useCallback((questionId, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  }, []);

  // Update a specific option on a question
  const updateOption = useCallback((questionId, optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  }, []);

  // Remove a question (but always keep at least one)
  const removeQuestion = useCallback((questionId) => {
    setQuiz(prev => {
      const updatedQuestions = prev.questions.filter(q => q.id !== questionId);
      return {
        ...prev,
        questions: updatedQuestions.length > 0 ? updatedQuestions : [defaultQuestion()]
      };
    });
  }, []);

  // Save quiz to localStorage as a mock backend
  const saveQuiz = useCallback(() => {
    const quizId = generateId();
    const quizData = {
      ...quiz,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      status: 'published'
    };
    localStorage.setItem(`quiz-${quizId}`, JSON.stringify(quizData));
    navigate(`/quiz/${quizId}`);
  }, [quiz, navigate, user]);

  // Validation helpers
  const isQuizValid =
    quiz.title.trim() &&
    quiz.questions.every(q => q.text.trim() && (q.type !== 'multiple-choice' || q.options.every(opt => opt.trim())));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Create New Quiz</h1>
        <p className="text-gray-600 dark:text-slate-300">Build an engaging quiz with multiple question types</p>
      </div>

      <div className="space-y-8">
        {/* Quiz Details */}
        <div className="card dark:bg-slate-700/80">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Quiz Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter quiz title"
                value={quiz.title}
                onChange={e => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Describe your quiz"
                value={quiz.description}
                onChange={e => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h3>
                {quiz.questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={e => updateQuestion(question.id, 'text', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <select
                    className="input-field"
                    value={question.type}
                    onChange={e => updateQuestion(question.id, 'type', e.target.value)}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>

                {/* Multiple Choice Options */}
                {question.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                            className="text-primary-600"
                          />
                          <input
                            type="text"
                            className="input-field flex-1"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={e => updateOption(question.id, optionIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* True/False */}
                {question.type === 'true-false' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          checked={question.correctAnswer === 0}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', 0)}
                          className="text-primary-600 mr-2"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          checked={question.correctAnswer === 1}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', 1)}
                          className="text-primary-600 mr-2"
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {/* Short Answer */}
                {question.type === 'short-answer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter the correct answer"
                      value={question.options[0] || ''}
                      onChange={e => updateOption(question.id, 0, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addQuestion}
            className="btn-secondary flex-1 sm:flex-none"
          >
            Add Question
          </button>
          <button
            onClick={saveQuiz}
            className="btn-primary flex-1 sm:flex-none"
            disabled={!isQuizValid}
          >
            Save & Preview Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;