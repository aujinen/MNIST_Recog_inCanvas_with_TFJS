# MNIST_Recog_inCanvas_with_TFJS
## 最新体験版のURL(変更する可能性あり)
[新潟大・西山・TFJS_HN](https://www5.dent.niigata-u.ac.jp/~nisiyama/TFJS_HN/)
## サーバへファイルをアップロードする場合
index.html<br>
data.js<br>
script.js<br>
の3つのファイルをアップロードする
## バージョン情報 
    by H.Nishiyama / aujinen
    2025/09/24 ver1.0
    2026-08-07 ver8.1
  Model architecture<br>
      https://github.com/aujinen/MNIST_Recog_inCanvas_with_TFJS/blob/main/model-archtecture.pdf<br>
  Based on<br>
      https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html<br>
  Ref:<br>
      https://js.tensorflow.org/api/latest<br>
      https://qiita.com/yukagil/items/ca84c4bfcb47ac53af99<br>
      https://qiita.com/niusounds/items/37c1f9b021b62194e077<br>
  supported by<br>
      GitHub copilot on VSCode<br>
## 動作環境（端末の制約）
歯学部指定のノートPC以上のスペックでの動作のみ保証します<br>
Google Chrome、Microsoft Edgeでの動作確認済みです。<br>
JavaScript VM動作用に520MB(10 epoch)〜3.1GB(100 epoch)程度のメモリが必要です<br>
※現状PCでのみ動作確認済み。iPhone等では動きません。（2025/10/20現在）<br>
## 実行手順
右サイドに表示される動作状況表示ウィンドウは[@]キーで開閉できます。<br>
[スペース]キーで最大画面表示・最小画面表示を切替できます。<br>
=== 実行手順 ===</p>
●エポック数（epochs）を1〜100の範囲で設定できます。<br>
エポック数を設定後、【学習実行】ボタンをクリックして下さい。<br>
右側に学習の進捗状況が表示されます。<br>
学習終了後、手書き文字入力エリアに任意の文字を描いてください。<br>
【予測】ボタンをクリックすると、認識結果が表示されます。<br>
【クリア】ボタンをクリックすると描画エリアがクリアされます。<br>
●学習後のモデルを保存する場合・・・<br>
　⇒ 【Save Model】ボタンをクリックしてください。<br>
　　2つのファイルをダウンロードする必要があるので、<br>
　　ブラウザにてアラートが出た場合は許可して下さい。<br>
　　ファイル名は「my-mnist-model_###.json」と「my-mnist-model_###.weights.bin」です。<br>
　　###にはエポック数が入ります。<br>
●保存されたモデルを読み込む場合・・・<br>
　⇒ json形式のモデルファイルとbin形式のパラメータファイルを選択し、<br>
　　【Load Model】ボタンをクリックしてください。<br>
　　サンプルとして、`1`から`100`までのフォルダ内に該当するエポック数にて学習済みのモデルとパラメータを読み込むこともできます。<br>
## 学習済みサンプルパラメータの利用
サブフォルダ`1`から`100`内に各エポック数にて学習させたサンプルのパラメータ(.bin)とモデル(.json)を置いています。
【Load Model】にて学習済みのサンプルを体験できます。
## 実行時の様子
<img width="711" height="729" alt="image01" src="https://github.com/user-attachments/assets/d0fb65dc-17c2-45e3-a71e-2a5af0bd100b" /><br>
＝＝＝<br>
<img width="893" height="832" alt="image02" src="https://github.com/user-attachments/assets/79be0c0f-a245-484b-85a8-c00f3b0610f2" /><br>
＝＝＝<br>
<img width="922" height="746" alt="image03" src="https://github.com/user-attachments/assets/47dcb0ae-4630-44c2-962f-a9a70822abdf" /><br>
＝＝＝<br>
<img width="859" height="510" alt="image04" src="https://github.com/user-attachments/assets/e9653221-e110-4a2e-b097-ba9954502793" /><br>
＝＝＝<br>
<img width="910" height="827" alt="image05" src="https://github.com/user-attachments/assets/91d05fdb-1890-4ca0-bad2-610299f9ee68" /><br>

