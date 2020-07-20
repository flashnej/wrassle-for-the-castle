class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :passcode, null: false
      t.float :current_castle, default: nil
      t.boolean :advance_to_battle, default: false
      t.boolean :advance_to_next_turn, default: false
      t.references :host, index: true
      t.references :guest, index: true

      t.timestamps
    end
  end
end
