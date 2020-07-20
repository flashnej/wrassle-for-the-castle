import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import TroopDeployForm from '../components/TroopDeployForm'
import ResultsScreen from '../components/ResultsScreen'
import RefreshButton from "../components/RefreshButton"
import curUserActions from '../store/actions/currentUser.js'
import opponentActions from '../store/actions/opponent.js'
import gameActions from '../store/actions/game.js'
import turnCycleActions from '../store/actions/turnCycle.js'
import { speakToUserChannel } from '../channels/channel_helper.js'

const GameScreenContainer = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const opponent = useSelector(state => state.opponent)
  const game = useSelector(state => state.game)
  const gameScreenPage = useSelector(state => state.turnCycle.gameScreenPage)
  const nextStep = useSelector(state => state.turnCycle.nextStep)

  const setCurrentUser = user => { dispatch(curUserActions.setCurrentUser(user)) }
  const setOpponent = user => { dispatch(opponentActions.setOpponent(user)) }
  const setGame = game => { dispatch(gameActions.setGame(game)) }
  const setCurrentPage = page => { dispatch(turnCycleActions.setCurrentPage(page)) }
  const setGameScreenPage = page => { dispatch(turnCycleActions.setGameScreenPage(page)) }
  const setUpdateMessage = msg => { dispatch(turnCycleActions.setUpdateMessage(msg)) }
  const setNextStep = step => { dispatch(turnCycleActions.setNextStep(step)) }

  useEffect(() => {
    handleRefresh()
    console.log("auto-refresh triggered")
  }, [
    currentUser.ready_for_battle,
    currentUser.ready_for_next_turn,
    opponent.ready_for_battle,
    opponent.ready_for_next_turn,
    game.guest_id
  ])

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
      ready_for_battle: true,
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
      if (game != null) {
        console.log("speaking")
        speakToUserChannel({ user: user })
      }
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
        Game Room: {game.passcode}
      </div>
      {showPage}
    </div>
  )
}

export default GameScreenContainer
