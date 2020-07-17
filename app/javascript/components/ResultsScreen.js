import React from 'react'

const ResultsScreen = (props) => {
    let presentation = (<h1> waiting for opponent </h1>)
    let display = "Waiting for your opponent. Send a scout out to spy on them!"

    if (props.game.guest_id) {
        display = ""
    }

    if (props.nextStep === "result") {
        presentation = (
          <div>
              <h1> your score: {props.currentUser.sent_soldiers} </h1>
              <h1> their score: {props.opponent.sent_soldiers} </h1>
          </div>
        )
    }

    return (
        <div>
            {presentation}
            <button type="button" className="button" onClick={() => props.setGameScreenPage("troopDeployForm")}>Next Castle</button>
        </div>
    )
}

export default ResultsScreen
