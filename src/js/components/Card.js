import React from 'react'
import PropTypes from 'prop-types'

function Card({ picture, country, author, star }) {
    return (
        <>
            <img className="card__image" src={picture} alt="picture" />
            <div className="card__details">
                <p className="card__homeland">Country: {country}</p>
                <p className="card__author">Author: {author}</p>
                <p className="card__star">
                    <span className="card__icon-star">
                        <img src="../../assets/img/star.png" />
                    </span>
                    <span className="card__text-star">{star}</span>
                </p>
            </div>
        </>
    )
}

Card.propTypes = {
    picture: PropTypes.string.isRequired
}

export default React.memo(Card)
