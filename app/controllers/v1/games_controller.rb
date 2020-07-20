class V1::GamesController < ApplicationController
  def create
    passcode = (0...8).map { (65 + rand(26)).chr }.join
    current_user = User.find(params[:host_id])
    # binding.pry
    game = Game.new(passcode: passcode, host: current_user, current_castle: 1.0)
    if game.save
      render json: {game: game}
    else
      render json: {error: "Error creating a game"}
    end
  end

  def show
    game = Game.where("passcode = ?", params[:id]).order(:created_at).last

    render json: {game: game}
  end

  def join
    game = Game.where("passcode = ?", params[:id]).order(:created_at).last
    if game
      current_user = User.find(params[:user_id])
      game.guest = current_user
      if game.save
        render json: {game: game}
      else
        render json: {error: "Error joining game"}
      end
    else
      render json: {error: "Passcode is not valid"}
    end
  end

  def refresh
    max_castles = 11
    game_status = "ongoing"
    game = Game.where("passcode = ?", params[:id]).order(:created_at).last
    if game
      current_user = User.find(params[:user_id])

      opponent_id = get_opponent_id(game, current_user.id)
      opponent = User.find(opponent_id)
      # binding.pry
      current_castle_floor = game.current_castle.floor().to_i()
      if current_user.ready_for_battle === true && opponent.ready_for_battle === true
        next_step = "result"
        current_user.ready_for_battle = false
        opponent.ready_for_battle = false
      elsif current_user.ready_for_next_turn === true && opponent.ready_for_next_turn === true
        next_step = "form"
        current_user.ready_for_next_turn = false
        opponent.ready_for_next_turn = false

        if current_castle_floor === max_castles
          next_step = "victory"
        else
          game.current_castle += 0.5
        end
      else
        # binding.pry
        next_step = "out-of-sync"
      end
      if game.save
        render json: {
          game: game,
          opponent: opponent,
          next_step: next_step,
          game_status: game_status
        }
      else
        render json: {error: "Error joining game"}
      end
    else
      render json: {error: "Passcode is not valid"}
    end
  end

  def points
    max_castles = 11
    current_user = User.find(params[:user_id])
    points = params[:points].to_i
    game = Game.find(params[:game_id])
    opponent_id = get_opponent_id(game, current_user.id)
    opponent = User.find(opponent_id)

    next_step = "form"
    if game.current_castle === max_castles
      next_step = "victory"
    end

    current_user.castle_points += points

    if current_user.save
      render json: {
        game: game,
        current_user: current_user,
        opponent: opponent,
        next_step: next_step
      }
    else
      render json: {error: "Error in game"}
    end
  end

  private

  def get_opponent_id(game, current_user_id)
    host_id = game.host.id

    if current_user_id === host_id
      return game.guest_id
    else
      return game.host_id
    end
  end

  # def assign_castle_points(current_user, opponent, current_castle)
  #   current_user_soldiers = current_user.sent_soldiers
  #   opponent_soldiers = opponent.sent_soldiers

  #   if current_user_soldiers > opponent_soldiers
  #     current_user.castle_points += current_castle
  #     return "current_user"
  #   elsif opponent_soldiers > current_user_soldiers
  #     opponent.castle_points += current_castle
  #     return "opponent"
  #   else
  #     return "tie"
  #   end

  #   current_user.save
  #   opponent.save
  # end
end
