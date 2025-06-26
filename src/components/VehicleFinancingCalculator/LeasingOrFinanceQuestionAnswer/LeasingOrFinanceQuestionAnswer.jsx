import React from "react";

const LeasingOrFinanceQuestionAnswer = ({ question, answer }) => {
  return (
    <div className="max-w-2xl m-auto w-full border rounded-sm mb-7">
      <h4 className="text-base font-semibold text-white bg-[var(--primary-color)] p-2">
        {question}
      </h4>
      <div className="text-sm bg-[var(--primary-color-10)] p-4">
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default LeasingOrFinanceQuestionAnswer;
