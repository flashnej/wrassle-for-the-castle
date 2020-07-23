import React from 'react'
import Flip from 'react-reveal/Flip';
import Pulse from 'react-reveal/Pulse';

const TroopDeployForm = (props) => {
  let presentation
  let refreshClass

  if (!props.game.guest_id) {
    refreshClass = "refresh"
    presentation = (
      <div>
        <img className="background" src={require('./background.jpg')} />
        <Flip bottom cascade>
          <h5 className="message">Our scouts are spying and waiting for your opponent's move...</h5>
        </Flip>
      </div>
    )
  } else {
    presentation = (
      <div>
        <Pulse>
          <img className="troops" src={require('./troops.png')} />
        </Pulse>
        <h1> Castle Number: {Math.ceil(props.game.current_castle)}</h1>
        <p>You have {props.currentUser.soldiers_remaining} troops remaining</p>
        <form onSubmit={props.submitSoldiers}>
          <label>How many troops would you like to send to castle #{Math.ceil(props.game.current_castle)}?
            <input type="number" pattern="[0-9]*" onChange={props.handleChange} />
            </label>
            <input className="button" type="submit" />
        </form>
      </div>)
  }

  return (
    <div>
      {presentation}
    </div>
  )
}

export default TroopDeployForm
