import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Tldraw,
  getSnapshot,
  loadSnapshot,
  type TLEditorSnapshot
} from 'tldraw'
import 'tldraw/tldraw.css'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExcalidrawExample() {
  const navigate = useNavigate()
  const { documentid } = useParams()
  const [documentId, setDocumentId] = useState<string>(documentid || '')
  const [editor, setEditor] = useState<any>(null)
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    if (!documentId || !editor) return

    const fetchAndLoadCanvas = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v0/tldraw/${documentId}`)
        const fetchedData = response.data?.tldraw?.data
        const fetchedTitle = response.data?.tldraw?.title || ''

        if (fetchedData) {
          console.log('✅ Fetched Canvas Data:', fetchedData)

          setTitle(fetchedTitle)

       
          loadSnapshot(editor.store, fetchedData as TLEditorSnapshot)

         
        }
      } catch (error) {
        console.error('❌ Error fetching/loading canvas data:', error)
      }
    }

    fetchAndLoadCanvas()
  }, [documentId, editor])

  const saveCanvasData = async () => {
    if (!editor) return

    try {
      const token = localStorage.getItem('token')

      const snapshot = getSnapshot(editor.store)
      const fullSnapshot: TLEditorSnapshot = {
        document: snapshot.document,
        session: snapshot.session
      }

      console.log('📤 Saving Snapshot:', fullSnapshot)

      const response = await axios.post(
        'http://localhost:3000/api/v0/tldraw',
        {
          documentId: documentId !== '' ? documentId : undefined,
          title,
          data: fullSnapshot,
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          }
        }
      )

      const savedId = response.data?.tldraw?._id
      if (savedId && documentId === '') {
        setDocumentId(savedId)
        navigate(`/excali/${savedId}`)
      }

      alert('✅ Saved successfully!')
      console.log('✅ Response from server:', response.data)
    } catch (error: any) {
      console.error('❌ Save failed:', error)
      alert('❌ Save failed')

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
  }

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* 🔹 Top bar with title and save button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300">
  {/* 🔙 Dashboard Button */}
  <button
    onClick={() => navigate('/dashboard')}
    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
  >
    <span className="text-xl">←</span> Dashboard
  </button>

  {/* 📝 Title Input */}
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter document title..."
    className="flex-1 mx-4 px-4 py-2 text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
  />

  {/* 💾 Save Button */}
  <button
    onClick={saveCanvasData}
    className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
  >
    Save
  </button>
</div>


      {/* 🔹 Tldraw canvas (adjust for top bar height) */}
      <div className="pt-20 h-full">
        <Tldraw
          onMount={(editorInstance) => {
            setEditor(editorInstance)
            const unsubscribe = editorInstance.store.listen(() => {
              const updatedSnapshot = getSnapshot(editorInstance.store)
              console.log('🖊️ Updated Canvas Data:', updatedSnapshot)
            }, { scope: 'all' })

            return () => unsubscribe()
          }}
        />
      </div>
    </div>
  )
}
