import React, { useState, useEffect } from 'react'

import TitleScreen from '../components/TitleScreen'
import StartGameScreen from '../components/StartGameScreen'
import JoinGameScreen from '../components/JoinGameScreen'
import GameScreenContainer from './GameScreenContainer'
import VictoryScreen from '../components/VictoryScreen'
import RefreshButton from '../components/RefreshButton'
import StatusMessage from '../components/StatusMessage'

const defaultGame = {
  id: null,
  passcode: null,
  current_castle: null
}
const defaultUser = {
  id: null,
  castle_points: null,
  screen_id: null,
  soldiers_remaining: null,
  sent_soldiers: null,
  ready_for_battle: null,
  ready_for_next_turn: null,
}
const defaultPasscode = {
  passcode: ""
}

const GameContainer = (props) => {
  const [game, setGame] = useState(defaultGame)
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [opponent, setOpponent] = useState(defaultUser)
  const [currentPage, setCurrentPage] = useState("titleScreen")
  const [gameScreenPage, setGameScreenPage] = useState('troopDeployForm')
  const [passcodeForm, setPasscodeForm] = useState(defaultPasscode)
  const [updateMessage, setUpdateMessage] = useState("")
  const [nextStep, setNextStep] = useState('')

  const handlePasscodeFormChange = (event) => {
    setPasscodeForm({
      ...passcodeForm,
      [event.currentTarget.id]: event.currentTarget.value
    })
  }

  useEffect(() => {
    fetch('/v1/users', {
      credentials: "same-origin",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      if (response.ok) {
        return response
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        let error = new Error(errorMessage)
        throw(error)
      }
    })
    .then((response) => response.json())
    .then((body) => {
      setCurrentUser(body)
    })
    .catch((error) => console.error(`Error in fetch: ${error.message}`))
  }, [])


  const handleRefresh = () => {
    if (!game.guest_id) {
      fetch(`/v1/games/${game.passcode}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          debugger
        }
      })
      .then(body => {
        setGame(body.game)
        if (!body.game.guest_id) {
          setUpdateMessage("Your opponent isn't ready for battle yet. You may want to send more scouts out to check on them in a few seconds.")
        } else {
          setUpdateMessage("")
        }
      })
    } else if (currentPage === "gameScreen") {
      fetch(`/v1/games/${game.passcode}/${currentUser.id}/refresh`)
      .then(response => {
        if (response.ok) {
          return response
        } else {
          let errorMessage = `${response.status} (${response.statusText})`
          let error = new Error(errorMessage)
          throw (error)
        }
      })
      .then(response => response.json())
      .then(body => {
        setGame(body.game)
        setOpponent(body.opponent)
        setNextStep(body.next_step)
        if (body.next_step === "result") {
          setGameScreenPage("resultsScreen")
          setUpdateMessage("")
        } else if (body.next_step === "form") {
          setGameScreenPage("troopDeployForm")
          setUpdateMessage("")
        } else if (body.next_step === "victory") {
          setCurrentPage("victoryScreen")
          setUpdateMessage("")
        } else {
          setUpdateMessage("your opponent is still choosing a number")
        }
      })
    }
  }

  let showPage = null
  if (currentPage === "titleScreen") {
    showPage = <TitleScreen setCurrentPage={setCurrentPage} />
  } else if (currentPage === "joinGameScreen") {
    showPage = (
      <JoinGameScreen
        setCurrentPage={setCurrentPage}
        setGame={setGame}
        handleFormChange={handlePasscodeFormChange}
        passcodeForm={passcodeForm}
        currentUser={currentUser}
        setOpponent={setOpponent}
    />
    )
  } else if (currentPage === "startGameScreen") {
    showPage = (
      <StartGameScreen
        setCurrentPage={setCurrentPage}
        game={game}
        setGame={setGame}
        currentUser={currentUser}
        setOpponent={setOpponent}
      />
    )
  } else if (currentPage === "gameScreen") {
    showPage = (
      <GameScreenContainer
        setCurrentPage={setCurrentPage}
        game={game}
        setGame={setGame}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setUpdateMessage={setUpdateMessage}
        gameScreenPage={gameScreenPage}
        setGameScreenPage={setGameScreenPage}
        opponent={opponent}
        nextStep={nextStep}
        handleRefresh={handleRefresh}
      />
    )
  } else if (currentPage === "victoryScreen") {
    showPage = (
      <VictoryScreen
        setCurrentPage={setCurrentPage}
      />
    )
  } else {
    showPage = <TitleScreen setCurrentPage={setCurrentPage} />
  }

  const onRefreshClick = (event) => {
    event.preventDefault()
    handleRefresh()
    console.log("Your scouts are checking on your opponent...")
  }

  return (
    <>
      <RefreshButton clickHandler={onRefreshClick} />
      <StatusMessage updateMessage={updateMessage}/>
      {showPage}
    </>
  )
}

export default GameContainer
