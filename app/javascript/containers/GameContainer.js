import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import TitleScreen from '../components/TitleScreen'
import StartGameScreen from '../components/StartGameScreen'
import JoinGameScreen from '../components/JoinGameScreen'
import GameScreenContainer from './GameScreenContainer'
import VictoryScreen from '../components/VictoryScreen'
import RefreshButton from '../components/RefreshButton'
import StatusMessage from '../components/StatusMessage'
import curUserActions from '../store/actions/currentUser.js'
import opponentActions from '../store/actions/opponent.js'
import gameActions from '../store/actions/game.js'
import turnCycleActions from '../store/actions/turnCycle.js'

import { subscribeToUserChannel } from '../channels/channel_helper'

const defaultPasscode = {
  passcode: ""
}

const GameContainer = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const opponent = useSelector(state => state.opponent)
  const game = useSelector(state => state.game)
  const currentPage = useSelector(state => state.turnCycle.currentPage)
  const updateMessage = useSelector(state => state.turnCycle.updateMessage)

  const setCurrentUser = user => { dispatch(curUserActions.setCurrentUser(user)) }
  const setOpponent = user => { dispatch(opponentActions.setOpponent(user)) }
  const setGame = game => { dispatch(gameActions.setGame(game)) }
  const setCurrentPage = page => { dispatch(turnCycleActions.setCurrentPage(page)) }
  const setUpdateMessage = msg => { dispatch(turnCycleActions.setUpdateMessage(msg)) }

  const [passcodeForm, setPasscodeForm] = useState(defaultPasscode)

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
        subscribeToUserChannel={() => subscribeToUserChannel(setOpponent, currentUser.id)}
      />
    )
  } else if (currentPage === "startGameScreen") {
    showPage = (
      <StartGameScreen
        setCurrentPage={setCurrentPage}
        game={game}
        setGame={setGame}
        currentUser={currentUser}
        subscribeToUserChannel={() => subscribeToUserChannel(setOpponent, currentUser.id)}
      />
    )
  } else if (currentPage === "gameScreen") {
    showPage = (
      <div>
        <StatusMessage updateMessage={updateMessage}/>
        <GameScreenContainer />
      </div>
    )
  } else if (currentPage === "victoryScreen") {
    showPage = (
      <VictoryScreen
        game={game}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setUpdateMessage={setUpdateMessage}
        opponent={opponent}
        setOpponent={setOpponent}
      />
    )
  } else {
    showPage = <TitleScreen setCurrentPage={setCurrentPage} />
  }

  return (
    <>
      {showPage}
    </>
  )
}

export default GameContainer
