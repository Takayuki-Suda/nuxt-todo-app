from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS  # flask-corsのインポート
from datetime import datetime
from flask_mysqldb import MySQL

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

# MySQLのカーソルをDictCursorに設定
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# タスク一覧の取得
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM tasks')
        tasks = cur.fetchall()

        task_list = []
        for task in tasks:
            print(f"Received task: {task}")  # タスクデータを表示

            # taskが辞書であるか確認
            if isinstance(task, dict): 
                # task['dueDate'] が datetime 型なら文字列に変換
                due_date = task['dueDate'].strftime('%Y-%m-%d %H:%M:%S') if task['dueDate'] else None

                task_list.append({
                    "id": task['id'],
                    "text": task['text'],
                    "completed": bool(task['completed']),
                    "dueDate": due_date  # 日付を文字列に変換して返す
                })

        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({"error": f"データベースエラー: {str(e)}"}), 500



# サーバー側のPOST処理
@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        # dataはリストの可能性があるが、タスクが1つだけであれば
        # 以下の処理がうまく動くようにする必要がある
        task = data[0] if isinstance(data, list) else data  # データがリストの場合
        # 追加処理
        ...
        return jsonify({"message": "タスクが正常に追加されました", "task": task}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    


# タスクの削除
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM tasks WHERE id = %s", [task_id])
        mysql.connection.commit()
        return jsonify({"message": "タスクが正常に削除されました"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# タスクの更新
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        # JSONデータの取得
        data = request.get_json()

        # 各フィールドを取得
        try:
            text = data['text']
        except KeyError:
            return jsonify({"error": "タスクのテキストは必須です"}), 400

        completed = data.get('completed')
        due_date = data.get('dueDate')

        # ISO 8601形式の日付をMySQLのDATETIME形式に変換
        if due_date:
            try:
                due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                return jsonify({"error": "無効な日付形式です"}), 400

        # データベースの更新
        cur = mysql.connection.cursor()
        cur.execute("""UPDATE tasks SET text = %s, completed = %s, dueDate = %s WHERE id = %s""", 
                    (text, completed, due_date, task_id))
        mysql.connection.commit()

        return jsonify({"message": "タスクが正常に更新されました"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
