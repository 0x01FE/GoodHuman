import sqlite3


DB = sqlite3.connect("goodhuman.db")
CUR = DB.cursor()


CUR.execute("CREATE TABLE members(user_name TEXT PRIMARY KEY NOT NULL, user_pass TEXT, group_id TEXT , currency_ammount INTEGER)")

