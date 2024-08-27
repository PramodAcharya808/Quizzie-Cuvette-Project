import React, { useRef } from "react";
import "./CopyLinkModal.css";
import { toast } from "react-toastify";
const CopyLinkModal = ({
  created,
  setCreated,
  setShow,
  setNext,
  resetForm1,
  setSelectedType,
  quizLink,
}) => {
  const inputRef = useRef(null);

  const copyToClipboard = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(
        () => {
          console.log("Copied to clipboard successfully!");
          toast.success("Link copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        }
      );
    }
  };

  const handleClose = () => {
    setShow(false);
    setCreated(false);
    setNext(false);
    resetForm1();
    setSelectedType(null);
    inputRef.current.value = "";
    window.location.reload();
  };

  const quizUrl = `http://localhost:5173/publicquiz/${quizLink}`;

  return (
    <div className="copy-quiz-link-container">
      <p className="close-btn" onClick={handleClose}>
        X
      </p>
      <div className="created-message">
        <p>Congrats your Quiz is Published!</p>
      </div>
      <input
        type="text"
        ref={inputRef}
        className="quizLink-copy"
        defaultValue={quizUrl}
        disabled
      />
      <button className="share-quiz" onClick={copyToClipboard}>
        Share
      </button>
    </div>
  );
};

export default CopyLinkModal;
