import React, { useState, useEffect } from 'react';
import { MdEdit , MdDelete } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface CardProps {
  title: string;
  documentId: string;
  tags: string;
  onClick?: () => void;
  createdAt: string;
  onEdit: (newTags: string) => void;
  type: 'text' | 'canvas';
  onTitleClick?: () => void;
}

export function Card({ title, documentId, type, onClick, createdAt, tags, onEdit, onTitleClick }: CardProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editedTags, setEditedTags] = useState(tags);
  const Navigate = useNavigate();

  useEffect(() => {
    setEditedTags(tags);
  }, [tags]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTags(true);
  };

  const handleSaveTags = () => {
    onEdit(editedTags);
    setIsEditingTags(false);
    console.log("Saved tags:", editedTags);
    const token = localStorage.getItem("token");
    axios.post(`http://localhost:3000/api/v0/notes/${documentId}/tags`, {
      tags: editedTags,
    },{
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    } );
  Navigate(0);
  }

  const DeleteHandler = () => {
    const token = localStorage.getItem("token");
  
    if (window.confirm("Are you sure you want to delete this note?")) {
      axios.delete(`http://localhost:3000/api/v0/notes/${documentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then(() => {
        Navigate(0); 
      })
      .catch(error => {
        console.error("Error deleting note:", error);
      });
     } 
    // else {
    //   Navigate(0);
    // }
  };

  

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className="border rounded p-2 bg-white hover:shadow-xl transition-all ease-in-out cursor-pointer h-24 w-100"
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h6  onClick={onTitleClick} className="text-sm font-medium text-gray-800 py-2 pl-3 hover:underline">{title}</h6>
            <span className="text-xs text-gray-500 pl-3">
              {createdAt
                ? new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </span>
            <div className="text-xs text-slate-500 pl-3 mt-1">{tags}</div>
          </div>

          <div className="flex items-center gap-2 ">
            <MdEdit
              onClick={handleEditClick}
              className="text-gray-500  hover:text-blue-500 cursor-pointer"
            />
            <MdDelete
              onClick={DeleteHandler}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
            />
        
            {type === 'text' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="0.8"
                stroke="currentColor"
                className="size-12"
              >
                
                <path
                  className="hover:fill-[#318CE7] text-gray-500"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            )}

            {type === 'canvas' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="0.8"
                stroke="currentColor"
                className="size-12"
              >
                <path
                  className="hover:fill-[#e73146] text-gray-500"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {isEditingTags && (
        <div className="fixed inset-0 bg-[rgba(128,128,128,0.2)] bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Tags</h3>
            <input
              type="text"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              placeholder="Enter tags (comma-separated)"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingTags(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTags}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}