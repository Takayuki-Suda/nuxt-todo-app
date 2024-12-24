from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS  # flask-corsのインポート
from datetime import datetime
import traceback

app = Flask(__name__)

# CORSの設定
CORS(app)

# MySQL設定
app.config['MYSQL_HOST'] = 'localhost'  # MySQLサーバのホスト
app.config['MYSQL_USER'] = 'root'       # MySQLのユーザー名
app.config['MYSQL_PASSWORD'] = 'root123!'  # MySQLのパスワード
app.config['MYSQL_DB'] = 'task_db'     # 使用するデータベース名
app.config['MYSQL_CHARSET'] = 'utf8mb4'  # 日本語対応
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

# タスク一覧の取得
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM tasks')
        tasks = cur.fetchall()

        task_list = []
        for task in tasks:
            due_date = task['dueDate'].strftime('%Y-%m-%d %H:%M:%S') if task['dueDate'] else None
            task_list.append({
                "id": task['id'],
                "text": task['text'],
                "completed": bool(task['completed']),
                "dueDate": due_date,
                "details": task.get('details')  # detailsも返す
            })

        return jsonify(task_list), 200
    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"データベースエラー: {str(e)}"}), 500

# タスクの追加
@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()

        # dataが辞書型であることを確認
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid data format, expected a JSON object"}), 400

        # 必要なフィールドがない場合の処理
        if not data.get('text') or not data.get('details'):
            return jsonify({"error": "Text and details are required"}), 400

        text = data.get('text').strip()
        completed = data.get('completed', False)
        due_date = data.get('dueDate')
        details = data.get('details', None)

        # 日付の処理
        if due_date:
            if due_date.endswith('Z'):
                due_date = due_date[:-1] + '+00:00'  # 'Z'を+00:00に変換
            due_date = datetime.fromisoformat(due_date).strftime('%Y-%m-%d %H:%M:%S')

        cur = mysql.connection.cursor()
        cur.execute(
            """INSERT INTO tasks (text, completed, dueDate, details) VALUES (%s, %s, %s, %s)""",
            (text, completed, due_date, details if details else None)
        )
        mysql.connection.commit()

        return jsonify({"message": "タスクが正常に追加されました", "task": data}), 201

    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500

# タスクの削除
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM tasks WHERE id = %s", [task_id])
        mysql.connection.commit()
        return jsonify({"message": "タスクが正常に削除されました"}), 200
    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500

# タスクの更新
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()

        # デバッグ用出力
        print("Received data:", data)
        print("Updating task with ID:", task_id)

        text = data.get('text')
        completed = data.get('completed')
        due_date = data.get('dueDate')
        details = data.get('details')

        # 必須フィールドの確認
        if not text or completed is None or due_date is None:
            return jsonify({"error": "text, completed, and dueDate are required"}), 400

        # 日付の処理
        if due_date:
            if due_date.endswith('Z'):
                due_date = due_date[:-1] + '+00:00'  # 'Z'を+00:00に変換
            try:
                due_date = datetime.fromisoformat(due_date).strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                return jsonify({"error": "Invalid dueDate format. Expected ISO 8601 format."}), 400

        # SQLクエリで更新
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE tasks 
            SET text = %s, completed = %s, dueDate = %s, details = %s 
            WHERE id = %s
        """, (text, completed, due_date, details, task_id))

        mysql.connection.commit()

        return jsonify({"message": "タスクが正常に更新されました"}), 200
    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
