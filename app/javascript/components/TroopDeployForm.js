import React from 'react'

const TroopDeployForm = (props) => {
    let display = "Waiting for your opponent. Send a scout out to spy on them!"
    let presentation = (<h1> waiting for a guest </h1>)

    if (props.game.guest_id) {
        display = ""
        presentation = (<div>
        <h1> Castle Number: {Math.ceil(props.game.current_castle)}</h1>
                <form onSubmit={props.submitSoldiers}>
                    <label>How many troops would you like to send to castle #{props.game.current_castle}?
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
