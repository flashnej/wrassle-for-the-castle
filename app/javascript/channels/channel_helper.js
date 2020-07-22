import consumer from "./consumer"

const subscribeToGameChannel = (setGame) => {
  console.log("subscribed to Game channel")

  consumer.subscriptions.create(
    { channel: "GameChannel" },
    {
      received: data => {
        console.log("received Game data:" + data.game.passcode)
        setGame(data.game)
      },
      speak: function(data) {
        return this.perform("speak", data)
      }
    }
  )
}

const speakToGameChannel = (game) => {
  getChannelByName("GameChannel").speak(game)
}

const subscribeToUserChannel = (setOpponent, currentUserId) => {
  console.log("subscribed to User channel")
  consumer.subscriptions.create(
    { channel: "UserChannel" },
    {
      received: data => {
        console.log("received User data, id:" + data.user.id)
        console.log("received User data, ready_for_battle:" + data.user.ready_for_battle)

        if (data.user.id !== currentUserId) setOpponent(data.user)
      },
      speak: function(data) {
        console.log("speaking User data, id:" + data.user.id)
        console.log("speaking User data, ready_for_battle:" + data.user.ready_for_battle)

        return this.perform("speak", data)
      }
    }
  )
}

const speakToUserChannel = (user) => {
  getChannelByName("UserChannel").speak(user)
}

const getChannelByName = (channelName) => {
  return consumer.subscriptions.subscriptions.find(subscription => {
    return subscription.identifier.includes(channelName)
  })
}

export {
  subscribeToGameChannel,
  speakToGameChannel,
  subscribeToUserChannel,
  speakToUserChannel
}
