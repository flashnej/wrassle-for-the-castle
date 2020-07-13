import React, { useState } from 'react'

import TroopDeployForm from '../components/TroopDeployForm'
import ResultsScreen from '../components/ResultsScreen'
import RefreshButton from "../components/RefreshButton"

const GameScreenContainer = (props) => {
  const { currentUser, setCurrentUser, game, setGame, opponent, setOpponent, setUpdateMessage, gameScreenPage, setGameScreenPage, nextStep, setNextStep, setCurrentPage } = props
  let display = "Waiting for your opponent. Send a scout out to spy on them!"

  if (game.guest_id) {
    display = ""
  }

  const handleRefresh = () => {
    if (!game.guest_id) {
      fetch(`/v1/games/${game.passcode}`)
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
        if (!body.game.guest_id) {
          setUpdateMessage("Your opponent isn't ready for battle yet. You may want to send more scouts out to check on them in a few seconds.")
        } else {
          setUpdateMessage("")
          setGame(body.game)
        }
      })
    } else {
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
        //check if guest ID
        //setUpdateMessage("Your opponent isn't ready for battle yet. You may want to send more scouts out to check on them in a few seconds.")
        console.log(body.next_step)
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

  const onRefreshClick = (event) => {
    event.preventDefault()
    handleRefresh()
    console.log("Your scouts are checking on your opponent...")
  }

  const submitSoldiers = (event) => {
    event.preventDefault()
    if (currentUser.sent_soldiers > currentUser.soldiers_remaining) {
      setUpdateMessage("You can not send more troops than you have available")
      return
    }
    setUpdateMessage("")
    const newSoldiersRemaining = currentUser.soldiers_remaining - currentUser.sent_soldiers
    const readyForBattleUser = {
      ...currentUser,
      soldiers_remaining: newSoldiersRemaining
    }

    fetch(`/v1/users/${currentUser.id}`,{
      credentials: "same-origin",
      method: "PATCH",
      body: JSON.stringify(readyForBattleUser),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
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
    .then(user => {
      console.log("submit soldier, user:" + user)
      console.log("submit soldier, opponent:" + opponent.id)
      setCurrentUser(user)
      setGameScreenPage("resultsScreen")
    })
  }

  const handleChange = (event) => {
    event.preventDefault()
    const newCurrentUser = {
      ...currentUser,
      sent_soldiers: event.currentTarget.value,
    }
    setCurrentUser(newCurrentUser)
  }

  const handleNextBattle = (points) => {
    fetch(`v1/games/${currentUser.id}/${game.id}/${points}/points`)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        debugger
      }
    })
    .then(body => {
      if (body.next_step === "form") {
        setGameScreenPage("troopDeployForm")
        setUpdateMessage("")
        setCurrentUser(body.current_user)
        setGame(body.game)
      } else if (body.next_step === "victory") {
        setCurrentPage("victoryScreen")
        setUpdateMessage("")
        setCurrentUser(body.current_user)
        return
      }
    })
  }

  let showPage = null
  if (gameScreenPage === 'troopDeployForm') {
    showPage = (<TroopDeployForm
    currentUser={currentUser}
    game={game}
    submitSoldiers={submitSoldiers}
    handleChange={handleChange}
    gameScreenPage={gameScreenPage}
    setGameScreenPage={setGameScreenPage}
    refreshClickHandler={onRefreshClick}
    />)
  } else if (gameScreenPage === 'resultsScreen') {
    showPage = (
      <ResultsScreen
        opponent={opponent}
        currentUser={currentUser}
        game={game}
        gameScreenPage={gameScreenPage}
        setGameScreenPage={setGameScreenPage}
        nextStep={nextStep}
        handleNextBattle={handleNextBattle}
        refreshClickHandler={onRefreshClick}
      />
    )
  }

  return (
    <div>
      <div className="session-id">
        Game Room: {props.game.passcode}
      </div>
      {showPage}
    </div>
  )
}

export default GameScreenContainer
