from flask import Flask, jsonify, request
import sqlite3


DB = sqlite3.connect("goodhuman.db")
CUR = DB.cursor()

app = Flask(__name__)

# MEMBERS

@app.route('/members/add', methods=['POST'])
def createUser():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"INSERT INTO members VALUE ({headers['user_name']}, {headers['user_pass']}, {data['group_id']}, {data['currency_ammount']})")
    return '', 204

@app.route('/members/group', methods=['GET'])
def getGroupIOwn():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"SELECT group_id WHERE user_name = {headers['user_name']}")
    db_data = CUR.fetchone().split(',')
    return jsonify({"group_id":db_data[0]}), 200

@app.route('/members/allgroups', methods=['GET'])
def getMyGroups():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"SELECT group_id WHERE user_name = {headers['user_name']}")
    db_data = CUR.fetchone().split(',')
    db_data.pop(0)
    return jsonify({"group_id":db_data}), 200

@app.route('/members/joingroup', methods=['POST'])
def getMyGroups():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"SELECT group_id WHERE user_name = {headers['user_name']}")
    db_data = CUR.fetchone()
    db_data = db_data + f",{str(data['group_id'])}"
    CUR.execute(f"UPDATE members SET group_id = {db_data} WHERE user_name = {headers['user_name']}")
    return '', 204
 


# CURRENCY

@app.route('/currency/user', methods=['GET'])
def getUserCurrency():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"SELECT currency_ammount FROM members WHERE user_name = {headers['user_name']}")
    currency = CUR.fetchone()
    return jsonify({'points':currency}), 200

@app.route('/currency/set', methods=['POST'])
def setUserCurrency():
    data = request.get_json()
    headers = request.headers
    CUR.execute(f"UPDATE members SET currency_ammount = {headers['points']} WHERE user_name = {headers['user_name']}")
    return '', 204



# TASKS

@app.route('')













