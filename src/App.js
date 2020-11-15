import React from 'react'
import Card from './js/components/Card.js'
import Carousel from './js/components/Carousel.js'

const mockImagesData = [
  'http://picsum.photos/400/200',
  'http://picsum.photos/350/200',
  'http://picsum.photos/500/200'
]
function App({ data }) {
  return (
    <div className="app">
      <Carousel>
        {data.map(dataElem => (
          <Card
            picture={dataElem.picture}
            country={dataElem.country}
            author={dataElem.author}
            star={dataElem.star}
            key={dataElem.id}
          />
        ))}
        {mockImagesData.map(img => (
          <img src={img} key={img} />
        ))}
        <b>Title</b>
        <i>End</i>
      </Carousel>
    </div>
  )
}

export default App
