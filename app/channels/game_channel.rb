class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'game_channel'
  end

  def speak(data)
    passcode = data['game']['passcode']
    game = Game.where("passcode = ?", passcode).order(:created_at).last
    socket = { game: game }
    GameChannel.broadcast_to('game_channel', socket)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
