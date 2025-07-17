import React from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

export default function LatexRenderer({ content }) {
  return (
    <MathJaxContext>
      <MathJax>{content}</MathJax>
    </MathJaxContext>
  )
}
