import React, { useEffect } from 'react'
import Tada from 'react-reveal/Tada';

const TitleScreen = (props) => {

  return (
    <div>
      <div>
        <Tada>
          <img className="castle" src={require('./castle.png')} alt="Top Down Castle Sprite@seekpng.com" />
          <h1 className="title">Wrassle for the Castle</h1>
        </Tada>
      </div>
      <div className="text-container">
        <h4 className="text-bold">Two generals send their armies to battle over the most valuable castles</h4>
        <div className="spacer" />
        <div className="container instructions">
          <p>
            Each general starts the game with 100 soldiers.
            There are a total of 10 castles.
            At each castle, you will have to decide how many soldiers to send to
            gain control of the castle. However, you won't know how many soldiers
            your opponent will be sending to the castle. The larger army wins the
            castle and gains the points value for the castle. At the end of 10
            rounds, the general with the most castle points wins the game.
          </p>
          <h5 className="text-bold">
            Who will be the most strategic general and win the game?
          </h5>
          <div className="spacer" />
          <h6>
            * While game is in session, please do not use your browser's back or refresh buttons
          </h6>
        </div>
        <div className="stacked-for-small button-group align-justify container">
          <button type="button" className="button" onClick={() => props.setCurrentPage("startGameScreen")}>Start a game</button>
          <button type="button" className="button" onClick={() => props.setCurrentPage("joinGameScreen")}>Join a game</button>
        </div>
      </div>
      <footer>
        <h6>
          'Wrassle for the Castle' is designed and developed by
          <a href="https://www.linkedin.com/in/andrew-lee-1701d/"> Andrew Lee</a>,
          <a href="https://www.linkedin.com/in/jason-flashner/"> Jason Flashner</a>,
          and <a href="https://www.linkedin.com/in/vivian-e-wang/"> Vivian Wang</a>
        </h6>
        <h6>
          Submission for <a href="https://sites.google.com/mintbean.io/2020-07-10-multiplayer-hackath/home?authuser=2">MintBean Multiplayer Hackathon </a>
          | July 10-13, 2020 | GitHub Repository <a href="https://github.com/flashnej/wrassle-for-the-castle">here</a>
        </h6>
      </footer>
    </div>
  )
}

export default TitleScreen
