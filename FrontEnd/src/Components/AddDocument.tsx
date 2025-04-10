import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddDocument() {
  const [Modal, setModal] = useState<Boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      
      <button onClick={() => setModal(true)} className="w-16 h-16 flex items-center justify-center rounded-full border-white bg-purple-500 hover:bg-purple-600 fixed right-10 bottom-10 z-50 border-2">
        <MdAdd className="text-[32px] text-white" />
      </button>

     
      {Modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400/20 z-40">
          <div className="bg-white p-8 rounded-lg w-[300px] h-[300px] opacity-100 shadow-lg border flex flex-col">
            
            <div className="flex py-2 gap-5 justify-center ">
              
              <div onClick={()=>{
                navigate("/texteditor")
              }} className="flex flex-col items-center hover:cursor-pointer hover:bg-gray-300 rounded-2xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-text-icon lucide-notebook-text">
                  <path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>
                </svg>
                <h1 className="mt-2 text-center text-sm">Add New Text Document</h1>
              </div>

            
              <div  onClick={()=>{
                navigate("/canvas")
              }} className="flex flex-col items-center hover:cursor-pointer hover:bg-gray-300 rounded-2xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sticky-note-icon lucide-sticky-note">
                  <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>
                </svg>
                <h1 className="mt-2 text-center text-sm">Add New Canvas</h1>
              </div>
            </div>

          
        <div className="pl-45 py-4 ">
        <button
              onClick={() => setModal(false)}
              className="self-end px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
