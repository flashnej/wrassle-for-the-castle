class V1::UsersController < ApplicationController
  def create
    user = User.new
    user.screen_id = Time.now.to_i
    user.save

    render json: user
  end

  def update
    if User.exists?(params[:id])
      user = User.find(params[:id])
      user.update_attributes(user_params)
      # user.ready_for_battle += 1
      # binding.pry
      if user.save
        render json: user
      else
        render json: { error: user.errors.full_messages.to_sentence }
      end
    else
      render json: { error: no_id_match_error_msg }
    end
  end

  def show
    render json: User.find(params[:id])
  end

  protected

  def user_params
    params.require(:user).permit(:screen_id, :soldiers_remaining, :sent_soldiers, :castle_points, :ready_for_battle, :ready_for_next_turn)
  end

  def no_id_match_error_msg
    return "ID doesn't match an existing User record"
  end
end
