import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;

}

interface FormatButtonProps {

  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;

}

export default function RichTextEditor({
  initialContent = "",
  onContentChange,

}: RichTextEditorProps) {
 
  const navigate = useNavigate();
  let { documentid } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState("");
//  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });

  // Fetch document data when component mounts or documentid changes
useEffect(() => {
  const fetchDocument = async () => {
    if (!documentid) {
      setContent("");
      setTitle("Untitled");
      documentid = "";
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/v0/notes/${documentid}`
      );
      if (response.data?.document) {
        setContent(response.data.document.content || "");
        setTitle(response.data.document.title || "");
        if (editorRef.current) {
          editorRef.current.innerHTML =
            response.data.document.content || "<p><br></p>";
        }
        
      }
    } catch (error) {
      console.error("Error fetching document", error);
    }
      };

      fetchDocument();
    }, [documentid]);



  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    onContentChange?.(newContent);
    updateActiveFormats();
  }, [onContentChange]);

  const toggleFormat = useCallback(
    (command: string) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      const range = selection?.rangeCount
        ? selection.getRangeAt(0).cloneRange()
        : null;

      document.execCommand(command);
      handleInput();

      if (range && selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    },
    [handleInput]
  );

  const insertCheckbox = useCallback(() => {
    if (!editorRef.current) return;

    const checkbox = document.createElement("span");
    checkbox.contentEditable = "false";
    checkbox.className =
      "inline-block w-4 h-4 border border-gray-400 mr-2 align-middle cursor-pointer hover:border-blue-500 transition-colors";
    checkbox.innerHTML = "☐ ";
    checkbox.onclick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.innerHTML = target.innerHTML === "☐ " ? "☑ " : "☐ ";
      handleInput();
    };

    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(checkbox);
      range.collapse(false);
      handleInput();
    }
  }, [handleInput]);

  // Update format states
  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
    });
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token:", token);
      // console.log("Sending Data:", { documentid, title, content });
    
    let response;
     if (documentid!=="") {
       response = await axios.post(
        "http://localhost:3000/api/v0/notes",
        { documentId: documentid, title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
     }
     else {
      response = await axios.post(
        "http://localhost:3000/api/v0/notes",
        {  title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

     }

      console.log("Success:", response!.data);
      let slug = (response.data.document._id);
       navigate(`/texteditor/${slug}`);
    } catch (error: any) {
      if (error.response.data.error.includes("E11000 duplicate key error")) {
        alert("Pleae Bhai title change karde please");
      }
      else if (error.response) {
        console.error(
          "Server Error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Axios Error:", error.message);
      }
    }
  };
  return (
    <div>
    
      <div
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer flex items-center gap-2 p-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-10 border-2 rounded-full p-2 hover:bg-blue-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
        <span className="text-lg font-medium">Back</span>
      </div>

      {/* Editor Container */}
      <div className="max-w-4xl mx-auto mt-0 border border-gray-200 rounded-lg shadow-lg bg-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          [contenteditable][placeholder]:empty::before {
            content: attr(placeholder);
            color: #94a3b8;
            pointer-events: none;
          }
        `,
          }}
        />

        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full px-3 py-2 text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <FormatButton
            onClick={() => toggleFormat("bold")}
            active={activeFormats.bold}
          >
            <span className="font-bold">B</span>
          </FormatButton>
          <FormatButton
            onClick={() => toggleFormat("italic")}
            active={activeFormats.italic}
          >
            <em className="italic">It</em>
          </FormatButton>

          <FormatButton
            onClick={() => toggleFormat("underline")}
            active={activeFormats.underline}
          >
            <u className="underline">U</u>
          </FormatButton>

          <FormatButton
            onClick={() => toggleFormat("strikeThrough")}
            active={activeFormats.strike}
          >
            <s>S</s>
          </FormatButton>

          <div className="border-l border-gray-300 h-6 mx-2" />

          <FormatButton
            onClick={() => {
              document.execCommand("insertUnorderedList");
              handleInput();
            }}
          >
            • List
          </FormatButton>

          <FormatButton
            onClick={() => {
              document.execCommand("insertOrderedList");
              handleInput();
            }}
          >
            1. List
          </FormatButton>

          <FormatButton onClick={insertCheckbox}>☐ Check</FormatButton>

          <button
            onClick={handleSave}
            className="ml-auto px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer transition"
          >
            Save
          </button>
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          className="min-h-[300px] p-4 outline-none prose max-w-none text-gray-800 focus:ring-0 placeholder-gray-400"
          style={{
            lineHeight: "1.5",
            caretColor: "#3b82f6",
          }}
        />
      </div>
    </div>

  );
}

const FormatButton: React.FC<FormatButtonProps> = ({
  onClick,
  active,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${
        active ? "bg-blue-100 text-blue-800" : "text-gray-700"
      }`}
    >
      {children}
    </button>
  );
};
