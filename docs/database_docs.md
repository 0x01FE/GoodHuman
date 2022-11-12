# Tables

## Members

user_name TEXT PRIMARY KEY NOT NULL
user_pass TEXT
group_id TEXT <- is actually just a list of csv's with the first being the group you own
currency_ammount INTEGER


## Tasks

task_id INTEGER PRIMARY KEY NOT NULL
tas_name TEXT
user_name TEXT
reward INTEGER <- amount of GBP
type TEXT
repeat TEXT
time TEXT
description TEXT
image TEXT
pending INTEGER
submit_time TEXT

## Reward

reward_id INTEGER PRIMARY KEY NOT NULL
reward_name TEXT
description TEXT
points INTEGER
pending INTEGER
user_name TEXT
submit_time TEXT










