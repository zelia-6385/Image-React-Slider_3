import React from 'react'
import PropTypes from 'prop-types'

const Dots = ({ cardsId, activeIndex, handlerCheckSlide }) => {
    return (
        <div className="carousel__dots">
            {cardsId.map((card, i) => (
                <Dot
                    key={i}
                    activeIndex={activeIndex}
                    index={i}
                    handlerCheckSlide={handlerCheckSlide}
                />
            ))}
        </div>
    )
}

const Dot = React.memo(function Dot({ activeIndex, index, handlerCheckSlide }) {
    return (
        <>
            <span
                onClick={() => handlerCheckSlide(index)}
                className={
                    activeIndex === index
                        ? 'carousel__dot active'
                        : 'carousel__dot'
                }
            ></span>
        </>
    )
})

Dots.propTypes = {
    slides: PropTypes.arrayOf(PropTypes.object.isRequired),
    activeIndex: PropTypes.number.isRequired,
    handlerCheckSlide: PropTypes.func.isRequired
}

Dot.propTypes = {
    activeIndex: PropTypes.number.isRequired,
    handlerCheckSlide: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

export default React.memo(Dots)
