import React from 'react'
import Flip from 'react-reveal/Flip';
import Slide from 'react-reveal/Slide';

import RefreshButton from './RefreshButton'

const ResultsScreen = (props) => {
  const { currentUser, opponent, game, setGameScreenPage, nextStep, nextCastle, handleNextBattle, refreshClickHandler } = props
  let presentation
  let refreshClass

  console.log("results screen, nextStep: " + nextStep)
  console.log("results screen, opponent: " + opponent.id)

  if (nextStep === "result") {
    let winnerMessage = "It's a tie! Neither of you won the castle.."
    let points = 0
    if (currentUser.sent_soldiers > opponent.sent_soldiers) {
      winnerMessage = "You won the castle"
      points = Math.ceil(game.current_castle) - 1
    } else if (opponent.sent_soldiers > currentUser.sent_soldiers) {
      winnerMessage = "Your opponent won the castle"
    }

    const handleClick = (event) => {
      event.preventDefault()
      handleNextBattle(points)
    }

    presentation = (
      <div className="resultsDisplay">
        <div className="grid-container fluid">
          <div className="grid-x grid-margin-x">
            <div className="cell small-4">
              <Slide left>
                <h4>You sent {currentUser.sent_soldiers} soldiers</h4>
                <img className="knight" src={require('./Knight_red.png')} />
              </Slide>
            </div>
            <div className="cell small-4">
              <img src={require('./castle.png')} />
            </div>
            <div className="cell small-4">
              <Slide right>
                <h4>They sent {opponent.sent_soldiers} soldiers</h4>
                <img className="knight" src={require('./Knight_blue.png')} />
              </Slide>
            </div>
          </div>
          <div className="spacer" />
          <h2 className="text-bold">{winnerMessage}</h2>
          <div className="spacer" />
          <button
            type="button"
            className="button large"
            onClick={(event) => handleClick(event)}
          >
            Next Battle
          </button>
        </div>
      </div>
    )
  } else {
    refreshClass = "refresh"
    presentation = (
      <div>
        <img className="background" src={require('./background.jpg')} />
        <Flip bottom cascade>
          <h5 className="message">Our scouts are spying and waiting for your opponent's move...</h5>
        </Flip>
      </div>
    )
  }

  return (
    <div>
        {presentation}
    </div>
  )
}

export default ResultsScreen
