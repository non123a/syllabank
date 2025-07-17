import React from 'react'

export default function PDFViewer() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <object
        data="/template/template_piu.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
      ></object>
    </div>
  )
}
