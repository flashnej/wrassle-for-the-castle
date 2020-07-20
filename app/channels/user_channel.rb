class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'user_channel'
  end

  def speak(data)
    user_id = data['user']['id']
    user = User.find(user_id)
    socket = { user: user }
    # binding.pry
    UserChannel.broadcast_to('user_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
