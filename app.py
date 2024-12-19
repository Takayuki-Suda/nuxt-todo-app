from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS  # flask-corsのインポート
from datetime import datetime

app = Flask(__name__)

# CORSを全てのルートに対して許可
CORS(app)

# MySQL設定
app.config['MYSQL_HOST'] = 'localhost'  # MySQLサーバのホスト
app.config['MYSQL_USER'] = 'root'       # MySQLのユーザー名
app.config['MYSQL_PASSWORD'] = 'root123!'  # MySQLのパスワード
app.config['MYSQL_DB'] = 'task_db'     # 使用するデータベース名
app.config['MYSQL_CHARSET'] = 'utf8mb4'  # 日本語を含むUTF-8の設定

mysql = MySQL(app)

# タスクモデルの取得
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM tasks')
    tasks = cur.fetchall()
    task_list = [{"id": task[0], "text": task[1], "completed": task[2], "dueDate": task[3]} for task in tasks]
    return jsonify(task_list)

# タスクの追加
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    text = data['text']
    completed = data['completed']
    due_date = data['dueDate']
    
    # ISO 8601形式の日付をMySQLのDATETIME形式に変換
    try:
        due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
    except ValueError as e:
        return jsonify({"error": "Invalid date format"}), 400
    
    cur = mysql.connection.cursor()
    try:
        cur.execute("INSERT INTO tasks (text, completed, dueDate) VALUES (%s, %s, %s)", (text, completed, due_date))
        mysql.connection.commit()
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "タスクが正常に追加されました"}), 201

# タスクの削除
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("DELETE FROM tasks WHERE id = %s", [task_id])
        mysql.connection.commit()
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "タスクが正常に削除されました"}), 200

# タスクの更新
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    text = data.get('text')
    completed = data.get('completed')
    due_date = data.get('dueDate')

    # ISO 8601形式の日付をMySQLのDATETIME形式に変換
    try:
        if due_date:
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
    except ValueError as e:
        return jsonify({"error": "Invalid date format"}), 400
    
    cur = mysql.connection.cursor()
    try:
        # タスクの更新
        cur.execute("""
            UPDATE tasks
            SET text = %s, completed = %s, dueDate = %s
            WHERE id = %s
        """, (text, completed, due_date, task_id))
        mysql.connection.commit()
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "タスクが正常に更新されました"}), 200


if __name__ == '__main__':
    app.run(debug=True)
