# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_11_170047) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.string "passcode", null: false
    t.float "current_castle"
    t.bigint "host_id"
    t.bigint "guest_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guest_id"], name: "index_games_on_guest_id"
    t.index ["host_id"], name: "index_games_on_host_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "screen_id", null: false
    t.integer "soldiers_remaining", default: 100, null: false
    t.integer "sent_soldiers"
    t.integer "castle_points", default: 0, null: false
    t.boolean "ready_for_battle", default: false
    t.boolean "ready_for_next_turn", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
