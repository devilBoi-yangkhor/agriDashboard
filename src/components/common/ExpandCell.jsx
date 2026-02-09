import { useState } from "react";
import DOMPurify from "dompurify";
import truncate from "truncate-html";

function ExpandCell({ answer }) {
  const [showFull, setShowFull] = useState(false);

  if (!answer) return <p></p>;

  // Sanitize but allow basic styling
  const sanitizedAnswer = DOMPurify.sanitize(answer, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'], // if you need iframes
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // if you need iframes
    ALLOWED_ATTR: ['style', 'class', 'href', 'target', 'src'] // Allow style and class attributes
  });

  // Truncate HTML safely to 70 chars, preserving tags
  const truncatedHtml = truncate(sanitizedAnswer, 70, { ellipsis: "..." });

  return (
    <div>
      <div
      className="not-tailwind"
        onClick={() => setShowFull((prev) => !prev)}
        dangerouslySetInnerHTML={{
          __html: showFull ? sanitizedAnswer : truncatedHtml,
        }}
      />
      {!showFull && truncatedHtml !== sanitizedAnswer && (
        <button 
          className="text-blue-500 text-sm mt-1 hover:underline"
          onClick={() => setShowFull(true)}
        >
          Read more
        </button>
      )}
      {showFull && truncatedHtml !== sanitizedAnswer && (
        <button 
          className="text-blue-500 text-sm mt-1 hover:underline"
          onClick={() => setShowFull(false)}
        >
          Show less
        </button>
      )}
    </div>
  );
}

export default ExpandCell;