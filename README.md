: ウェルカムページを削除
Nuxt の初期プロジェクトには app.vue に <NuxtWelcome /> が記述されている可能性があります。
この場合、これを削除してください：

起動方法
npm run dev
localhost:3000 で app.vue が表示される。

git 操作方法
1:リモートリポジトリを作成
2:git init
3:git remote add origin URL
4:git add .
5:git commit -m "Initial commit"
6:git push -u origin main

flowchart 作成方法

1.拡張機能 PlantUML をインストール
2.task_flow.puml を作成(例)
3.jdk をインストール
4.plantuml-x.xxxx.x.jar をインストールし任意のディレクトリに保存
5.java -jar D:/tools/plantuml/plantuml-x.xxxx.x.jar task_flow.puml

ブランチを作成したらリモートリポジトリにプッシュする
git push -u origin <ブランチ名>

サーバーを起動
python app.py
