import React, { useState } from 'react'
import { Document, Page } from '@react-pdf/renderer'

export default function PDFBase64Viewer() {
  const [base64, setBase64] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const handleInputChange = (e) => {
    setBase64(e.target.value)
  }

  return (
    <div style={{ padding: '20px' }}>
      <textarea
        value={base64}
        onChange={handleInputChange}
        placeholder="Paste your base64 encoded PDF here"
        rows={5}
        style={{ width: '100%', marginBottom: '20px' }}
      />
      {base64 && (
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <Document
            file={`data:application/pdf;base64,${base64}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
