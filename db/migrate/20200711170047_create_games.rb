class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :passcode, null: false
      t.float :current_castle, default: nil
      t.float :advance_to_results, default: nil
      t.float :advance_to_castle, default: nil
      t.references :host, index: true
      t.references :guest, index: true

      t.timestamps
    end
  end
end
