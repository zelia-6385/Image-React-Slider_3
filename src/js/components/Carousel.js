import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dots from './Dots'

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
  }

  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string.isRequired)
  }

  componentDidMount() {
    // creating fake cards
    const firstCardClone = this.cardContainer.children[0].cloneNode(true)
    const lastCardClone = this.cardContainer.children[
      this.cardContainer.children.length - 1
    ].cloneNode(true)

    this.img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

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
        this.moveCard(0.0, widthCard)
      }
    )

    // add event listener for resize
    window.addEventListener('resize', this.resizeWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWidth)
  }

  // event handlers
  handleDragStart = e => {
    e.dataTransfer.setDragImage(this.img, -10, -10)
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
    this.setState(
      {
        ...this.state,
        widthCard: this.cardContainer.children[0].offsetWidth
      },
      () => {
        const { widthCard, currentCard } = this.state

        this.moveCard(0.0, widthCard * currentCard)
      }
    )
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
        () => this.moveCard(0.5, null)
      )
    } else if (change < 0 && change < -widthCard / 2) {
      this.handlePrevios()
    } else if (change < 0 && change >= -widthCard / 2) {
      this.setState(
        {
          ...this.state,
          change: 0
        },
        () => this.moveCard(0.5, null)
      )
    }
  }

  // Новая функция по перемещению слайдов
  handleMoveSlide = valueOn => {
    if (valueOn === 'next') {
      this.changeBooleanValue('next')
    }
    if (valueOn === 'previos') {
      this.changeBooleanValue('previos')
    }
  }

  updateNewCurrentCard = () => {
    const { currentCard, next, previos } = this.state

    let newCurrentCard = null

    if (next) {
      if (previos) {
        this.setState({
          ...this.state,
          previos: !previos
        })
      }

      newCurrentCard = currentCard + 1

      this.setNewCurrentCard(newCurrentCard, this.handleNextMoveCard)
    }

    if (previos) {
      if (next) {
        this.setState({
          ...this.state,
          next: !next
        })
      }

      newCurrentCard = currentCard - 1

      this.setNewCurrentCard(newCurrentCard, this.handlePreviosMoveCard)
    }
  }

  setNewCurrentCard = (newCurrentCard, callback) => {
    this.setState(
      {
        ...this.state,
        currentCard: newCurrentCard,
        change: 0
      },
      callback
    )
  }

  changeBooleanValue = stateElem => {
    this.setState(
      {
        ...this.state,
        [stateElem]: !this.state.stateElem
      },
      this.updateNewCurrentCard
    )
  }

  // move to the next slide
  handleNext = () => {
    const { currentCard } = this.state

    if (currentCard < this.cardContainer.children.length - 1) {
      let newCurrentCard = currentCard + 1

      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0
        },
        this.handleNextMoveCard
      )
    }
  }

  handleNextMoveCard = () => {
    const { widthCard, currentCard } = this.state

    this.moveCard(0.5, widthCard * currentCard)

    if (currentCard === this.cardContainer.children.length - 1) {
      setTimeout(
        () =>
          this.setState(
            {
              ...this.state,
              currentCard: 1,
              change: 0
            },
            () => {
              const { widthCard } = this.state
              this.moveCard(0.0, widthCard)
            }
          ),
        502
      )
    }
  }

  // move to the previos slide
  handlePrevios = () => {
    const { currentCard } = this.state

    if (this.state.currentCard > 0) {
      let newCurrentCard = currentCard - 1

      this.setState(
        {
          ...this.state,
          currentCard: newCurrentCard,
          change: 0
        },
        this.handlePreviosMoveCard
      )
    }
  }

  handlePreviosMoveCard = () => {
    const { widthCard, currentCard } = this.state

    this.moveCard(0.5, widthCard * currentCard)

    if (currentCard === 0) {
      setTimeout(() => {
        this.setState(
          {
            ...this.state,
            currentCard: this.cardContainer.children.length - 2,
            change: 0
          },
          () => {
            const { widthCard } = this.state

            this.moveCard(
              0.0,
              widthCard * (this.cardContainer.children.length - 2)
            )
          }
        )
      }, 502)
    }
  }

  // method for run and stop autorun
  handleAutorun = () => {
    const { timerIdAuto } = this.state

    if (!timerIdAuto) {
      this.setState({
        ...this.state,
        timerIdAuto: setInterval(() => this.handleMoveSlide('next'), 2000)
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

        this.moveCard(0.5, widthCard * currentCard)
      }
    )
  }

  // method for change transform / transition css props
  moveCard = (transitionDuration, transform) => {
    this.cardContainer.style.transitionDuration = `${transitionDuration}s`
    this.cardContainer.style.transform = `translate(-${transform}px)`
  }

  render() {
    const { currentCard, timerIdAuto, change } = this.state

    const childrenArr = React.Children.toArray(this.props.children)
    const children = childrenArr.map((child, i) => (
      <div className="card" key={i}>
        {child}
      </div>
    ))

    return (
      <div className="carousel">
        <div className="carousel__controls">
          <button
            onClick={() => this.handleMoveSlide('previos')}
            className="carousel__button"
          >
            Previous
          </button>
          <button
            onClick={() => this.handleMoveSlide('next')}
            className="carousel__button"
          >
            Next
          </button>
          <button onClick={this.handleAutorun} className="carousel__button">
            {!timerIdAuto ? 'Autorun' : 'Stop'}
          </button>
        </div>
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
            {children}
          </div>
        </div>
        <Dots
          cardsId={childrenArr}
          activeIndex={currentCard - 1}
          handlerCheckSlide={this.checkSlide}
        />
      </div>
    )
  }
}

export default Carousel
