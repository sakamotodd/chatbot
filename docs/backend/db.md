
Enum template_type {
  start             // 0:開始
  message           // 1:メッセージ
  tree              // 2:探索木
  lottery_group     // 3:抽選
  end               // 4:終了
}

Enum node_type {
  first_trigger               // 0:開始
  message                     // 1:メッセージ
  message_select_option       // 2:選択肢
  lottery                     // 3:抽選
  lottery_message             // 4:抽選メッセージ
}

Enum message_type {
  text       // 0:text
  media      // 1:media
  card       // 2:card
  select     // 3:select
}


Table campaigns {
  id bigint [pk, increment]
  title varchar(255) [not null]
  description text
  status varchar(50) [not null, default: 'draft']
  start_date timestamp
  end_date timestamp
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "キャンペーンテーブル"
}

Table in_instantwin_prizes {
  id bigint [pk, increment]
  campaign_id bigint [not null, ref: > campaigns.id]
  name varchar(255) [not null]
  description text
  send_winner_count int [not null, default: 0]
  winner_count int [not null, default: 0]
  winning_rate_change_type int [not null, default: 0]
  winning_rate decimal(10,4) [not null, default: 0.0000]
  daily_winner_count int [default: null]
  is_daily_lottery boolean [not null, default: false]
  lottery_count_per_minute int [default: null]
  lottery_count_per_minute_updated_datetime timestamp
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "インスタグラムインスタントウィンキャンペーン専用の賞品テーブル"
}

Table in_instantwin_templates {
  id bigint [pk, increment]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  name varchar(120) 
  type template_type [not null]
  step_order int [not null]
  is_active boolean [not null, default: true]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "テンプレートフロー定義テーブル"
}

Table in_instantwin_nodes {
  id bigint [pk, increment]
  template_id bigint [not null, ref: > in_instantwin_templates.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  type node_type [not null]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "テンプレート側のノード情報を管理するためのテーブル"
}

Table in_instantwin_edges {
  id bigint [pk, increment]
  template_id bigint [not null, ref: > in_instantwin_templates.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  source_node_id bigint [not null, ref: > in_instantwin_nodes.id]
  target_node_id bigint [not null, ref: > in_instantwin_nodes.id]
  condition_data json
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "ノードの流れを把握するためのテーブル"
}

Table in_instantwin_messages {
  id bigint [pk, increment]
  node_id bigint [not null, ref: > in_instantwin_nodes.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  text text
  message_type message_type [not null]
  media_id bigint
  media_url varchar(500)
  metadata json
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "ノードに紐づくメッセージを表す"
}

Table in_instantwin_message_maps {
  message_id: [pk, ref: > in_instantwin_messages.id]
  in_instantwin_nodes: [pk, ref: > in_instantwin_nodes.id]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
}

Table in_instantwin_message_select_options {
  id bigint [pk, increment]
  node_id bigint [not null, ref: > in_instantwin_nodes.id]
  parent_node_id bigint [ref: > in_instantwin_nodes.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  select_option varchar(255) [not null]
  option_value varchar(255)
  display_order int [not null, default: 0]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "選択肢オプション管理テーブル"
}

Table in_instantwin_message_cards {
  id bigint [pk, increment]
  message_id bigint [not null, ref: > in_instantwin_messages.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  title varchar(255) [not null]
  subtitle varchar(500)
  image_url varchar(500)
  card_url varchar(500)
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "メッセージカード情報テーブル"
}

Table in_instantwin_message_card_buttons {
  id bigint [pk, increment]
  message_card_id bigint [not null, ref: > in_instantwin_message_cards.id]
  button_title varchar(255) [not null]
  button_url varchar(500)
  button_type varchar(50) [not null, default: 'url']
  display_order int [not null, default: 0]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "メッセージカードボタン管理テーブル"
}

Table in_instantwin_conversations {  
  id bigint [pk, increment]
  campaign_id bigint [not null, ref: > campaigns.id]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  template_id bigint [ref: > in_instantwin_templates.id]
  current_node_id bigint [ref: > in_instantwin_nodes.id]
  instagram_user_id varchar(255) [not null]
  sender_id bigint
  message_text text
  message_timestamp timestamp [not null, default: `now()`]
  is_from_user boolean [not null, default: true]
  is_first_trigger boolean [not null, default: false]
  is_last_trigger boolean [not null, default: false]
  session_data json
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "ユーザー会話履歴管理テーブル"
}

Table in_instantwin_message_lottery {
  id bigint [pk, increment]
  prize_id bigint [not null, ref: > in_instantwin_prizes.id]
  node_id bigint [not null, ref: > in_instantwin_nodes.id]
  message_id bigint [ref: > in_instantwin_messages.id]
  is_win boolean [not null, default: false]
  created timestamp [not null, default: `now()`]
  modified timestamp [not null, default: `now()`]
  
  Note: "抽選テーブル"
}

