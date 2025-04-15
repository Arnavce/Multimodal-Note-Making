import { Tldraw, getSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExcalidrawExample() {
  const [canvasData, setCanvasData] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string>('1234'); // Set default ID for testing or can be dynamic
  const [editor, setEditor] = useState<any>(null); // To store editor instance

  // Fetch the canvas data on component mount or when documentId changes
  useEffect(() => {
    if (documentId) {
      axios
        .get(`http://localhost:3000/api/v0/tldraw/${documentId}`)
        .then((response) => {
          if (response.data.tldraw) {
            setCanvasData(response.data.tldraw.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching canvas data:', error);
        });
    }
  }, [documentId]);

  const saveCanvasData = async() => {
    if (!editor) return; // Ensure the editor is loaded
    const data = getSnapshot(editor.store); // Get snapshot from editor store

    if (!data) return; // Prevent saving if there's no data

    // Send the data to the backend (either create or update)
   const response1 = await  axios
      .post('http://localhost:3000/api/v0/tldraw', {
        documentId: documentId || '1234', // If documentId exists, update; otherwise, create
        title: 'My Canvas Title', // You can change this to your dynamic title
        data: data, // The data of the canvas
      })
      .then((response) => {
        // Handle success response (e.g., save documentId if new document is created)
        const createdDocumentId = response.data.tldraw._id || '1234';
        setDocumentId(createdDocumentId); // Update the documentId if it's a new one
        alert('Canvas saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving canvas:', error);
        alert('Failed to save canvas');
      });
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Tldraw
        onMount={(editorInstance) => {
          // Set the editor instance
          setEditor(editorInstance);

          // If canvas data exists, set it in the editor
          if (canvasData) {
            editorInstance.store.setState(canvasData); // Apply fetched data to the editor
          }

          // Subscribe to store changes to capture real-time updates
          const unsubscribe = editorInstance.store.listen(() => {
            const updatedSnapshot = getSnapshot(editorInstance.store);
            setCanvasData(updatedSnapshot);
            console.log('Updated Canvas Data:', updatedSnapshot);
          }, { scope: 'all' });

          // Clean up on unmount
          return () => {
            unsubscribe();
          };
        }}
      />

      {/* Save Button */}
      <button
        onClick={saveCanvasData}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Save Canvas
      </button>
    </div>
  );
}
