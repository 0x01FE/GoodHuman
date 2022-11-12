from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import sqlite3 as sql
import json
from datetime import datetime
from random import random

# datetime.now().strftime("%H:%M")
#DB = sqlite3.connect(DATABASE, check_same_thread=False)
#CUR = DB.cursor()

DATABASE = "goodhuman.db"
app = Flask(__name__)
CORS(app)

def try_parse_json(req):
    try:
        return req.get_json()
    except Exception:
        return {}

class Opener():
    def __init__(self, req):
        self.con = sql.connect(DATABASE)
        self.req = req
    def __enter__(self):
        print(f"""Request [{self.req.headers['user-name']}] 🠒 {self.req.path}: \
            {try_parse_json(self.req)}""")
        
        return self.con, self.con.cursor(), try_parse_json(self.req), self.req.headers
    def __exit__(self, type, value, traceback):
        self.con.commit()
        self.con.close()

@app.route('/members/add', methods=['POST'])
def createUser():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT * FROM members WHERE user_name = ?", [headers['user-name']])
        db_data = cur.fetchall()
        if not db_data:
            return '', 204
        else:
            if 'group_id' in data:
                group = data['group_id']
            else:
                group = str(random())
            cur.execute("INSERT INTO members VALUES (?, ?, ?, NULL)", [headers['user-name'], headers['user_pass'], group])
            return '', 204

@app.route('/members/group', methods=['GET'])
def getGroupIOwn():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT group_id FROM members WHERE user_name = ?", [headers['user-name']])
        db_data = cur.fetchone()
        db_data = db_data.split(",")
        response = app.response_class(
            response=json.dumps({"group_id":str(db_data[0])}),
            status=200,
            mimetype='application/json')
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/members/allgroups', methods=['GET'])
def getMyGroups():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT group_id FROM members WHERE user_name = ?", [headers['user-name']])
        db_data = cur.fetchone()
        db_data = db_data.split(',')
        db_data.pop(0)
        response = app.response_class(
            response=json.dumps({"group_id":db_data}),
            status=200,
            mimetype='application/json')
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/members/joingroup', methods=['POST'])
def joinGroup():
    with Opener(request) as (con, cur, data, headers):
        db_data = cur.fetchone()
        db_data = db_data + f",{str(data['group_id'])}"
        cur.execute("UPDATE members SET group_id = ? WHERE user_name = ?", [db_data, headers['user-name']])
    return '', 204
 
@app.route('/currency/user', methods=['GET'])
def getUserCurrency():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT currency_ammount FROM members WHERE user_name = ?", [headers['user-name']])
        currency = cur.fetchone()
        response = app.response_class(
            response=json.dumps({'points':currency}),
            status=200,
            mimetype='application/json')
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/currency/set', methods=['POST'])
def setUserCurrency():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("UPDATE members SET currency_ammount = ? WHERE user_name = ?", [data['points'], data['user_name']])
    return '', 204

# this is for local use (not an endpoint)
def addUserCurrency(user_name,ammount):
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT currency_ammount FROM members WHERE user_name = ?", [user_name])
        new_points = int(cur.fetchone()) + ammount
        cur.execute("UPDATE members SET currency_ammount = ? WHERE user_name = ?", [new_points, user_name])

@app.route('/task/submit', methods=['POST'])
def submitTask():
    with Opener(request) as (con, cur, data, headers):
        time_now = datetime.now().strftime("%H:%M")
        cur.execute("UPDATE tasks SET image = ?, user_name = ?, pending = 1, submit_time = ? WHERE task_name = ?", [data['image'], headers['user-name'], time_now, data['task-name']])
    return '', 204

@app.route('/task/add', methods=['POST'])
def addTask():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT task_id FROM tasks ORDER BY task_id DESC")
        highest_id = cur.fetchone()
        if not highest_id:
            highest_id = 1
        else:    
            highest_id+=1
        cur.execute("INSERT INTO tasks VALUES (?, ?, NULL, ?, ?, ?, ?, ?, NULL, NULL, NULL)", [highest_id+1, data['task-name'], data['points'], data['type'], data['repeat'], data['time'], data['description']])
    return '', 204

def getTask(task_id):
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT * FROM tasks WHERE task_id = ?", [task_id])
        task = cur.fetchone()
    return task

@app.route('/reward/redeem', methods=['POST'])
def redeemReward():
    with Opener(request) as (con, cur, data, headers):
        time_now = datetime.now().strftime("%H:%M")
        cur.execute(f"UPDATE rewards SET user_name = ?, pending = 1, submit_time = ? WHERE reward_name ?", [headers['user-name'], time_now, data['reward_name']])
    return '', 204

@app.route('/reward/pending', methods=['GET'])
def getPendingRewards():
    with Opener(request) as (con, cur, data, headers):
        cur.execute("SELECT user_name, reward_id, reward_name, submit_time FROM rewards WHERE pending = 1")
        pending_rewards = cur.fetchall()
        response = app.response_class(
            response=json.dumps({"pending_rewards":pending_rewards}),
            status=200,
            mimetype='application/json')
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response


'''
@app.route("/task/review", methods=['POST'])
def reviewTask():
    with sql.connect(DATABASE) as con:
        cur = con.cursor()
        data = try_parse_json(request)
        headers = request.headers

        match data['review']:
            # Give points,remove task
            case 'accept':
                task = getTask(headers['task_id'])
                addUserCurrency(task[''])

            # Go turn off pending remove user
            case 'redo':

            # remove task, 
            case 'deny':
    return '', 204
'''