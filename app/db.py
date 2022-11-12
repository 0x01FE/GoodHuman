import sqlite3


DB = sqlite3.connect("goodhuman.db")
CUR = DB.cursor()

#CUR.execute("DROP TABLE rewards")
#CUR.execute("DROP TABLE tasks")
CUR.execute("CREATE TABLE rewards(reward_id INTEGER PRIMARY KEY NOT NULL, reward_name TEXT, description TEXT, points INTEGER, pending INTEGER, user_name TEXT, submit_time TEXT)")


