import React, { useEffect } from 'react'
import Flip from 'react-reveal/Flip';

import { subscribeToGameChannel } from '../channels/channel_helper'

const StartGameScreen = (props) => {
  const createNewGameFetch = () => {
    const newGameParams = {
      host_id: props.currentUser.id
    }
    fetch('/v1/games', {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(newGameParams),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      if (response.ok) {
        return response
      } else {
        debugger
      }
    })
    .then((response) => response.json())
    .then((body) => {
      props.setGame(body.game)
      subscribeToGameChannel(props.setGame)
    })
  }

  useEffect(() => {
    createNewGameFetch()
  },[])

  let gameShow = null
  let instructions = null
  if (props.game.passcode) {
    gameShow = props.game.passcode
    instructions = "Provide the passcode below to your opponent, and enter \
    the game when you are ready."
  }

  return (
    <div>
      <div className="container">
        <Flip right>
          <img className="lobby" src={require('./lobby.png')} alt="lobby"/>
        </Flip>
        <h4>
          {instructions}
        </h4>
        <h2>
          {gameShow}
        </h2>
      </div>
      <button type="button" className="button large" onClick={() => props.setCurrentPage("gameScreen")}>Enter Game</button>
    </div>
  )
}

export default StartGameScreen
