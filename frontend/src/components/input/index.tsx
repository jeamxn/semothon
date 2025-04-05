import React from "react";

const Input = ({
  title,
  essential = false,
  limit,
  placeholder,
  text,
  setText,
}: {
  title?: string;
  essential?: boolean;
  limit?: number;
  placeholder?: string;
  
  text?: string;
  setText?: React.Dispatch<React.SetStateAction<string>>;
  }) => {
  const [tText, setTText] = React.useState("");
  const [tmpText, setTmpText] = text && setText ? [text, setText] : [tText, setTText];

  return (
    <div className="flex flex-col gap-2">
      {
        title || essential || limit ? (
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1 items-center">
              {title && <p className="font-bold">{title}</p>}
              {essential && <p className="font-bold text-key">*</p>}
            </div>
            {limit && <p className="text-dark/20">{tmpText.length}/{limit}글자</p>}
          </div>
        ) : null
      }
      {
        limit ? limit < 500 ? (
          <input
            type="text"
            placeholder={placeholder}
            value={tmpText}
            onChange={(e) => setTmpText(e.target.value)}
            maxLength={limit}
            className="bg-dark/5 outline-none rounded-xl px-4 py-4 placeholder:text-dark/35"
          />
        ) : (
          <textarea
            placeholder={placeholder}
            value={tmpText}
            onChange={(e) => setTmpText(e.target.value)}
            maxLength={limit}
            className="bg-dark/5 outline-none rounded-xl px-4 py-4 placeholder:text-dark/35 resize-none"
            rows={4}
          />
        ) : null
      }
    </div>
  );
};

export default Input;