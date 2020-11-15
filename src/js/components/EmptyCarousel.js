import React from 'react'

function EmptyCarousel() {
  return (
    <div
      className="card"
      style={{
        width: '450px',
        height: '300px'
      }}
    >
      No content
    </div>
  )
}

export default React.memo(EmptyCarousel)
