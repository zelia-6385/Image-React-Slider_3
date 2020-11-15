import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dots from './Dots'
import EmptyCarousel from './EmptyCarousel'

export class Carousel extends PureComponent {
  constructor(props) {
    super(props)

    // initial state
    this.state = {
      currentCard: 1,
      widthCard: null,
      timerIdAuto: null,
      timerId: null,
      start: 0,
      change: 0,
      touch: 0,
      next: false,
      previos: false
    }

    // refereces
    this.setCardContainer = element => {
      this.cardContainer = element
    }

    this.setViewPort = element => {
      this.viewPort = element
    }

    this.handleTouchMove.passive = false

    this.img = new Image()

    this.childrenArr = React.Children.toArray(this.props.children)

    this.children = this.childrenArr.map((child, i) => (
      <div className="card" key={i}>
        {child}
      </div>
    ))
  }

  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string.isRequired)
  }

  componentDidMount() {
    this.img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

    if (this.childrenArr.length > 1) {
      // creating fake cards
      const firstCardClone = this.cardContainer.children[0].cloneNode(true)
      const lastCardClone = this.cardContainer.children[
        this.cardContainer.children.length - 1
      ].cloneNode(true)

      // initial change state
      this.setState(
        {
          ...this.state,
          widthCard: this.cardContainer.children[0].offsetWidth
        },
        () => {
          const { widthCard } = this.state

          this.cardContainer.insertBefore(
            lastCardClone,
            this.cardContainer.children[0]
          )
          this.cardContainer.append(firstCardClone)
          this.moveCard({
            transitionDuration: 0.0,
            transform: widthCard
          })
        }
      )
    } else {
      // initial change state
      this.setState({
        ...this.state,
        widthCard: this.cardContainer.children[0].offsetWidth
      })
    }

    // add event listener for resize
    const debounce = (func, delay) => {
      let inDebounce
      return function () {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
      }
    }

    window.addEventListener('resize', debounce(this.resizeWidth, 12))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.resizeWidth, 12))
  }

  // event handlers
  handleDragStart = e => {
    e.dataTransfer.setDragImage(this.img, -10, -10)

    if (this.childrenArr.length <= 1) {
      return
    }

    this.setState({
      ...this.state,
      timerId: setInterval(() => {
        const { start, touch } = this.state

        this.setState({
          ...this.state,
          change: start - touch
        })
      }, 40),
      start: e.clientX
    })
  }

  handleDragOver = e => {
    e.preventDefault()

    this.setState({
      ...this.state,
      touch: e.clientX
    })
  }

  handleDragEnd = () => {
    const { timerId } = this.state

    clearInterval(timerId)
    this.setState(
      {
        ...this.state,
        timerId: null,
        touch: 0,
        start: 0
      },
      () => {
        const { change } = this.state

        this.slideShow(change)
      }
    )
  }

  handleTouchStart = e => {
    if (this.childrenArr.length <= 1) {
      return
    }

    this.setState({
      ...this.state,
      timerId: setInterval(() => {
        const { start, touch } = this.state

        let moveFinger = touch ? touch : start
        this.setState({
          ...this.state,
          change: start - moveFinger
        })
      }, 60),
      start: e.touches[0].clientX
    })
  }

  handleTouchMove = e => {
    const { currentCard, widthCard } = this.state

    // e.preventDefault()
    e.stopPropagation()

    if (
      e.targetTouches[0].clientX <= 0 ||
      e.targetTouches[0].clientX > widthCard
    ) {
      this.handleTouchEnd()
    }

    this.setState({
      ...this.state,
      touch: e.touches[0].clientX
    })
  }

  handleTouchEnd = () => {
    const { timerId } = this.state

    clearInterval(timerId)
    this.setState(
      {
        ...this.state,
        timerId: null,
        touch: 0,
        start: 0
      },
      () => {
        const { change } = this.state

        this.slideShow(change)
      }
    )
  }

  // method for adaptive change slider
  resizeWidth = () => {
    if (this.childrenArr.length <= 1) {
      this.setState({
        ...this.state,
        widthCard: this.cardContainer.children[0].offsetWidth
      })
    } else {
      this.setState(
        {
          ...this.state,
          widthCard: this.cardContainer.children[0].offsetWidth
        },
        () => {
          const { widthCard, currentCard } = this.state

          this.moveCard({
            transitionDuration: 0.0,
            transform: widthCard * currentCard
          })
        }
      )
    }
  }

  // method for move slides with swipe and drag and drop effects
  slideShow = change => {
    const { widthCard } = this.state

    if (change > 0 && change > widthCard / 2) {
      this.handleNext()
    } else if (change > 0 && change <= widthCard / 2) {
      this.setState(
        {
          ...this.state,
          change: 0
        },
        () =>
          this.moveCard({
            transitionDuration: 0.5,
            transform: null
          })
      )
    } else if (change < 0 && change < -widthCard / 2) {
      this.handlePrevios()
    } else if (change < 0 && change >= -widthCard / 2) {
      this.setState(
        {
          ...this.state,
          change: 0
        },
        () =>
          this.moveCard({
            transitionDuration: 0.5,
            transform: null
          })
      )
    }
  }

  // move to the next slide
  handleNext = () => {
    const { currentCard, next } = this.state
    let newCurrentCard = currentCard + 1

    if (!next) {
      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0,
          previos: false,
          next: true
        },
        this.handleMoveCard
      )
    } else {
      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0
        },
        this.handleMoveCard
      )
    }
  }

  // move to the previos slide
  handlePrevios = () => {
    const { currentCard, previos } = this.state
    let newCurrentCard = currentCard - 1
    if (!previos) {
      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0,
          previos: true,
          next: false
        },
        this.handleMoveCard
      )
    } else {
      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0
        },
        this.handleMoveCard
      )
    }
  }

  // callback for move card
  handleMoveCard = () => {
    const { widthCard, currentCard, next, previos } = this.state

    const cardArrayLength = this.cardContainer.children.length

    this.moveCard({
      transitionDuration: 0.5,
      transform: widthCard * currentCard
    })

    if (next && currentCard === cardArrayLength - 1) {
      this.moveCardDeferredСall(1, () => {
        this.moveCard({
          transitionDuration: 0.0,
          transform: widthCard
        })
      })
    }

    if (previos && currentCard === 0) {
      this.moveCardDeferredСall(cardArrayLength - 2, () => {
        this.moveCard({
          transitionDuration: 0.0,
          transform: widthCard * (cardArrayLength - 2)
        })
      })
    }
  }

  moveCardDeferredСall = (currentCard, callback) => {
    setTimeout(() => {
      this.setState(
        {
          ...this.state,
          currentCard: currentCard,
          change: 0
        },
        callback
      )
    }, 502)
  }

  // method for run and stop autorun
  handleAutorun = () => {
    const { timerIdAuto } = this.state

    if (!timerIdAuto) {
      this.setState({
        ...this.state,
        timerIdAuto: setInterval(this.handleNext, 2000)
      })
    } else {
      clearInterval(timerIdAuto)

      this.setState({
        ...this.state,
        timerIdAuto: null
      })
    }
  }

  // method for change slids by dots
  checkSlide = index => {
    this.setState(
      {
        currentCard: index + 1
      },
      () => {
        const { currentCard, widthCard } = this.state

        this.moveCard({
          transitionDuration: 0.5,
          transform: widthCard * currentCard
        })
      }
    )
  }

  // method for change transform / transition css props
  moveCard = ({ transitionDuration, transform }) => {
    this.cardContainer.style.transitionDuration = `${transitionDuration}s`
    this.cardContainer.style.transform = `translate(-${transform}px)`
  }

  render() {
    const { currentCard, timerIdAuto, change, width, height } = this.state

    return (
      <div className="carousel">
        {this.childrenArr.length > 1 && (
          <div className="carousel__controls">
            <button onClick={this.handlePrevios} className="carousel__button">
              Previous
            </button>
            <button onClick={this.handleNext} className="carousel__button">
              Next
            </button>
            <button onClick={this.handleAutorun} className="carousel__button">
              {!timerIdAuto ? 'Autorun' : 'Stop'}
            </button>
          </div>
        )}
        <div className="carousel__title">Unknown masterpieces</div>
        <div
          onDragStart={this.handleDragStart}
          onDragOver={this.handleDragOver}
          onDragEnd={this.handleDragEnd}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          className="carousel__view-port"
          ref={this.setViewPort}
        >
          <div
            draggable="true"
            ref={this.setCardContainer}
            className="carousel__card-container"
            style={{
              left: -change + 'px'
            }}
          >
            {this.childrenArr.length ? this.children : <EmptyCarousel />}
          </div>
        </div>
        {this.childrenArr.length > 1 && (
          <Dots
            cardsId={this.childrenArr}
            activeIndex={currentCard - 1}
            handlerCheckSlide={this.checkSlide}
          />
        )}
      </div>
    )
  }
}

export default Carousel
