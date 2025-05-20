import React from 'react';
import '../styles/QuestionInput.css';

type QuestionInputProps = {
  question: string;
  setQuestion: (value: string) => void;
  handleAsk: () => void;
};

export function QuestionInput({ question, setQuestion, handleAsk }: QuestionInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (e.key === 'Enter') {
	  handleAsk();
	}
  };

  return (
	<div className="question-container">
	  <input
		type="text"
		value={question}
		onChange={(e) => setQuestion(e.target.value)}
		onKeyDown={handleKeyDown}
		placeholder="Ex: Jag vill ha en elcykel för stadspendling"
		className="question-input"
	  />
	  <button onClick={handleAsk} className="question-button">
		Sök
	  </button>
	</div>
  );
}