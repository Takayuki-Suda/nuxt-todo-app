from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime
import traceback

app = Flask(__name__)

# CORS設定
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
        cur.execute('SELECT * FROM tasks ORDER BY `order`')
        tasks = cur.fetchall()

        task_list = []
        for task in tasks:
            due_date = task['dueDate'].strftime('%Y-%m-%d %H:%M:%S') if task['dueDate'] else None
            task_list.append({
                "id": task['id'],
                "text": task['text'],
                "completed": bool(task['completed']),
                "dueDate": due_date,
                "details": task.get('details')
            })

        return jsonify(task_list), 200
    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"データベースエラー: {str(e)}"}), 500

# タスクの追加（orderを順番に設定）
@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()

        if not isinstance(data, dict):
            return jsonify({"error": "Invalid data format, expected a JSON object"}), 400

        if not data.get('text') or not data.get('details'):
            return jsonify({"error": "Text and details are required"}), 400

        text = data.get('text').strip()
        completed = data.get('completed', False)
        due_date = data.get('dueDate')
        details = data.get('details', None)

        if due_date:
            if due_date.endswith('Z'):
                due_date = due_date[:-1] + '+00:00'
            due_date = datetime.fromisoformat(due_date).strftime('%Y-%m-%d %H:%M:%S')

        cur = mysql.connection.cursor()

        # 現在の最大orderを取得
        cur.execute("SELECT MAX(`order`) AS max_order FROM tasks")
        max_order_result = cur.fetchone()
        max_order = max_order_result['max_order'] if max_order_result['max_order'] is not None else -1

        # 次のorderを設定
        next_order = max_order + 1

        cur.execute(
            """INSERT INTO tasks (text, completed, dueDate, details, `order`) VALUES (%s, %s, %s, %s, %s)""",
            (text, completed, due_date, details if details else None, next_order)
        )
        mysql.connection.commit()

        return jsonify({"message": "タスクが正常に追加されました", "task": data}), 201

    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500

# タスクの削除（orderを調整）
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        cur = mysql.connection.cursor()

        # 削除対象のタスクのorderを取得
        cur.execute("SELECT `order` FROM tasks WHERE id = %s", [task_id])
        task_to_delete = cur.fetchone()

        if not task_to_delete:
            return jsonify({"error": "Task not found"}), 404

        delete_order = task_to_delete['order']

        # タスクを削除
        cur.execute("DELETE FROM tasks WHERE id = %s", [task_id])
        mysql.connection.commit()

        # 削除後、orderを調整
        cur.execute("UPDATE tasks SET `order` = `order` - 1 WHERE `order` > %s", [delete_order])
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

# タスクの順序を更新
@app.route('/api/tasks/order', methods=['PUT'])
def update_task_order():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({"error": "Invalid data format, expected a list of tasks"}), 400

        cur = mysql.connection.cursor()

        # タスクの順序を一括更新
        try:
            for task in data:
                task_id = task.get('id')
                new_order = task.get('order')

                if task_id is None or new_order is None:
                    return jsonify({"error": "Task ID and order are required"}), 400

                cur.execute("""
                    UPDATE tasks
                    SET `order` = %s
                    WHERE id = %s
                """, (new_order, task_id))

            # コミットして変更を確定
            mysql.connection.commit()

            return jsonify({"message": "タスクの順序が正常に更新されました"}), 200

        except Exception as e:
            # エラー発生時にロールバック
            mysql.connection.rollback()
            return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500


@app.route('/api/tasks/sort_by_due_date', methods=['PUT'])
def sort_tasks_by_due_date():
    try:
        cur = mysql.connection.cursor()

        # 完了していないタスクを期限順に取得
        cur.execute("SELECT id FROM tasks WHERE completed = 0 ORDER BY dueDate ASC")
        tasks_incomplete = cur.fetchall()

        # 完了したタスクを取得
        cur.execute("SELECT id FROM tasks WHERE completed = 1 ORDER BY dueDate ASC")
        tasks_complete = cur.fetchall()

        # 完了していないタスクの順番でorderを更新
        for index, task in enumerate(tasks_incomplete):
            cur.execute("""
                UPDATE tasks
                SET `order` = %s
                WHERE id = %s
            """, (index, task['id']))

        # 完了したタスクの順番でorderを更新（完了タスクは最後尾に）
        offset = len(tasks_incomplete)  # 完了タスクの最初の位置は未完了タスクの数
        for index, task in enumerate(tasks_complete):
            cur.execute("""
                UPDATE tasks
                SET `order` = %s
                WHERE id = %s
            """, (offset + index, task['id']))

        mysql.connection.commit()

        return jsonify({"message": "タスクが期限順に並び替えられました"}), 200

    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500
    
@app.route('/api/tasks/completed', methods=['delete'])
def delete_completed_tasks():
    try:
        cur = mysql.connection.cursor()

        # トランザクション開始
        mysql.connection.begin()

        # 完了したタスクを削除
        cur.execute("DELETE FROM tasks WHERE completed = 1")

        # コミットして変更を保存
        mysql.connection.commit()

        return jsonify({"message": "完了したタスクが削除されました"}), 200

    except Exception as e:
        # エラー発生時にはロールバック
        mysql.connection.rollback()
        
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500


@app.route('/api/tasks/dueDate', methods=['GET'])
def get_tasks_by_due_date():
    try:
        due_date_str = request.args.get('due_date')
        if not due_date_str:
            return jsonify({"error": "期限日を指定してください"}), 400

        query = "SELECT * FROM tasks WHERE dueDate <= %s"
        cur = mysql.connection.cursor()
        cur.execute(query, (due_date_str,))
        tasks = cur.fetchall()

        task_list = []
        for task in tasks:
            task_list.append({
                "id": task["id"],
                "text": task["text"],
                "completed": task["completed"],
                "dueDate": task["dueDate"],
                "details": task["details"],
                "order": task["order"]
            })

        return jsonify({"tasks": task_list}), 200

    except Exception as e:
        print("Error occurred:", str(e))
        print(traceback.format_exc())
        return jsonify({"error": f"サーバーエラー: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
