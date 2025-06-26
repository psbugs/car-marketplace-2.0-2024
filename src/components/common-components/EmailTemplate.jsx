import { useEffect } from "react";

const EmailTemplate = ({ subject, body, email }) => {
  useEffect(() => {
    // URL encode the subject and body
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const link = document.createElement("a");
    link.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

    link.click();
  }, [subject, body, email]);

  return null;
};

export default EmailTemplate;
