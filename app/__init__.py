from flask import Flask, jsonify, request
import sqlite3 as sql
import  json
from datetime import datetime
# datetime.now().strftime("%H:%M")

#DB = sqlite3.connect("goodhuman.db", check_same_thread=False)
#CUR = DB.cursor()

app = Flask(__name__)

# MEMBERS

@app.route('/members/add', methods=['POST'])
def createUser():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("INSERT INTO members VALUES (?, ?, ?, NULL)", [headers['user_name'], headers['user_pass'], data['group_id']])
        con.commit()
    return '', 204

@app.route('/members/group', methods=['GET'])
def getGroupIOwn():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("SELECT group_id WHERE user_name = ?", [headers['user_name']])
        db_data = cur.fetchone().split(',')
    return jsonify({"group_id":str(db_data[0])}), 200

@app.route('/members/allgroups', methods=['GET'])
def getMyGroups():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("SELECT group_id WHERE user_name = ?", [headers['user_name']])
        db_data = cur.fetchone().split(',')
        db_data.pop(0)
    return jsonify({"group_id":db_data}), 200

@app.route('/members/joingroup', methods=['POST'])
def joinGroup():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute(f"SELECT group_id WHERE user_name = ?", [headers['user_name']])
        db_data = cur.fetchone()
        db_data = db_data + f",{str(data['group_id'])}"
        cur.execute("UPDATE members SET group_id = ? WHERE user_name = ?", [db_data, headers['user_name']])
        con.commit()
    return '', 204
 


# CURRENCY

@app.route('/currency/user', methods=['GET'])
def getUserCurrency():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("SELECT currency_ammount FROM members WHERE user_name = ?", [headers['user_name']])
        currency = cur.fetchone()
    return jsonify({'points':currency}), 200

@app.route('/currency/set', methods=['POST'])
def setUserCurrency():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("UPDATE members SET currency_ammount = ? WHERE user_name = ?", [headers['points'], headers['user_name']])
        con.commit()
    return '', 204



# TASKS

@app.route('/task/submit', methods=['POST'])
def submitTask():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        time_now = datetime.now().strftime("%H:%M")
        cur.execute("UPDATE tasks SET image = ?, user_name = ?, pending = 1, submit_time = ? WHERE task_name = ?", [data['image'], headers['user_name'], time_now, data['task_name']])
        con.commit()
    return '', 204

@app.route('/task/add', methods=['POST'])
def addTask():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("SELECT task_id FROM tasks ORDER BY task_id DESC")
        highest_id = int(cur.fetchone())
        cur.execute("INSERT INTO tasks VALUE (?, ?, NULL, ?, ?, ?, ?, ?, NULL, NULL)", [highest_id+1, data['task_name'], data['points'], data['type'], data['repeat'], data['time'], data['description']])
        con.commit()
    return '', 204









# REWARDS

@app.route('/reward/redeem', methods=['POST'])
def redeemReward():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        time_now = datetime.now().strftime("%H:%M")
        cur.execute(f"UPDATE rewards SET user_name = ?, pending = 1, submit_time = ? WHERE reward_name ?", [headers['user_name'], time_now, data['reward_name']])
        con.commit()
    return '', 204


@app.route('/reward/pending', methods=['GET'])
def getPendingRewards():
    with sql.connect("goodhuman.db") as con:
        cur = con.cursor()
        data = request.get_json()
        headers = request.headers
        cur.execute("SELECT user_name, reward_id, reward_name, submit_time FROM rewards WHERE pending = 1")
        pending_rewards = cur.fetchall()
    return jsonify({"pending_rewards":pending_rewards})










