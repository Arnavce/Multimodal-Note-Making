import { useEffect, useState } from "react";
import { Card } from "../Components/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/searchBar";
import { AddDocument } from "../Components/AddDocument";


interface Document {
  _id: string;
  title: string;
  type: "text" | "canvas";
  createdAt: string;
  tags: string;
}

export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found! Redirecting to Signin...");
          navigate("/signin");
          return;
        }

        const [notesResponse, canvasResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/v0/notes", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }),
          axios.get("http://localhost:3000/api/v0/canvas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }),
        ]);

        const notes = notesResponse.data.document.map((doc: any) => ({
          _id: doc._id,
          title: doc.title,
          type: "text",
          createdAt: doc.createdAt,
          tags: doc.tags,
        }));

        const canvases = canvasResponse.data.document.map((canvas: any) => ({
          _id: canvas._id,
          title: canvas.title,
          type: "canvas",
        }));

        setDocuments([...notes, ...canvases]);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Server Response:", error.response.data);
        }
      }
    }

    fetchData();
  }, [navigate, ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="top-0 py-2 border-2 border-gray-200 bg-white flex justify-between items-center">
        <div className="flex flex-row items-center justify-items-start">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="46" 
            height="46" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-purple-500"
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
            <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
            <path d="M6 18a4 4 0 0 1-1.967-.516"/>
            <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
          </svg>
          
          <div className="text-2xl font-bold font-sans text-purple-500 pl-2">
            DASHBOARD
          </div>

          <div className="pl-75 ">
            <SearchBar
              value={searchValue}
              onChange={handleInputChange}
              onClearSearch={handleClearSearch}
            />
          </div>
        </div>

        <div className="pr-5">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            className=" bg-white text-purple-500 border-2 font-bold px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white cursor-pointer transition mr-6"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-7 pl-2 pr-1 grid-cols-3">
        {filteredDocuments.map((doc) => (
          <Card
            onTitleClick={() => {
              navigate(doc.type === "text" 
                ? `/texteditor/${doc._id}` 
                : `/canvas/${doc._id}`);
            }}
            
            key={doc._id}
            title={doc.title}
            type={doc.type}
            documentId={doc._id}
            createdAt={doc.createdAt}
            tags={doc.tags}
            onEdit={() => {}}
          />
        ))}
      </div>
{/* 
      <div className="flex flex-row gap-4 justify-end p-6">
        <div onClick={() => navigate("/texteditor")}>
          <svg 
            className="hover:fill-purple-500 cursor-pointer" 
            xmlns="http://www.w3.org/2000/svg" 
            width="100" 
            height="100" 
            viewBox="0 0 50 50"
          >
            <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"/>
          </svg>
        </div>

        <div onClick={() => navigate("/canvas")}>
          <svg 
            className="hover:fill-purple-500 cursor-pointer"  
            xmlns="http://www.w3.org/2000/svg"  
            width="200" 
            height="210"  
            viewBox="0 0 50 50"
          >
            <path d="M20 2C21.6569 2 23 3.34315 23 5V7H21V19C21 20.6569 19.6569 22 18 22H4C2.34315 22 1 20.6569 1 19V17H17V19C17 19.5128 17.386 19.9355 17.8834 19.9933L18 20C18.5128 20 18.9355 19.614 18.9933 19.1166L19 19V4H6C5.48716 4 5.06449 4.38604 5.00673 4.88338L5 5V15H3V5C3 3.34315 4.34315 2 6 2H20Z"/>
          </svg>
        </div>
      </div> */}
      <AddDocument />
    </div>
  );
}