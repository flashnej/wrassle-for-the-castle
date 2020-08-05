import consumer from "./consumer"

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
  subscribeToUserChannel,
  speakToUserChannel
}
