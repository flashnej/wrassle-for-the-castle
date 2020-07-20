import React from 'react'
import Flip from 'react-reveal/Flip';

import { subscribeToUserChannel, speakToUserChannel } from '../channels/channel_helper'

const JoinGameScreen = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    if (props.passcodeForm.passcode.trim() === "") {
      alert("Please enter in the passcode your opponent provided you to join a game")
    } else {
      fetch(`/v1/games/${props.passcodeForm.passcode}/${props.currentUser.id}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          alert("No game session matching the passcode was found. Please confirm the passcode")
        }
      })
      .then(body => {
        if (body.error) {
          alert("No game session matching the passcode was found. Please confirm the passcode")
        } else {
          props.setGame(body.game)
          props.setCurrentPage("gameScreen")
          subscribeToUserChannel(props.setOpponent, props.currentUser.id)
          if (props.currentUser != null) speakToUserChannel({ user: props.currentUser })
        }
      })
    }
  }

  return (
    <div className="container">
      <Flip right>
        <img className="lobby" src={require('./lobby.png')} alt="lobby"/>
      </Flip>
      <div className="spacer" />
      <form onSubmit={handleSubmit}>
        <label htmlFor="passcode"><h4>Enter the passcode to join a game: </h4></label>
        <input
          id="passcode"
          name="passcode"
          type="text"
          value={props.passcodeForm.passcode}
          onChange={props.handleFormChange}
          />
        <input
          type="submit"
          className="button large"
          value="Join Game"
        />
      </form>
    </div>
  )
}

export default JoinGameScreen
