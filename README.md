# MNIST_Recog_inCanvas_with_TFJS
## サーバへファイルをアップロードする場合
index.html<br>
data.js<br>
script.js<br>
の3つのファイルをアップロードする
## バージョン情報 
    by H.Nishiyama / aujinen
    2025/09/24 ver1.0
    2025/10/22 ver7.1
  Based on<br>
      https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html<br>
  Ref:<br>
      https://js.tensorflow.org/api/latest<br>
      https://qiita.com/yukagil/items/ca84c4bfcb47ac53af99<br>
      https://qiita.com/niusounds/items/37c1f9b021b62194e077<br>
  supported by<br>
      GitHub copilot on VSCode<br>
## 実行手順
※現状PCでのみ動作確認済み。iPhone等では上手く動きません。（2025/10/20現在）<br>
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
●保存されたモデルを読み込む場合・・・<br>
 ⇒ json形式のモデルファイルとbin形式のパラメータファイルを選択し、<br>
  【Load Model】ボタンをクリックしてください。<br>
## 学習済みサンプルパラメータの利用
※サブフォルダ内にフォルダ名のエポック数にて学習させたサンプルのパラメータを置いています。
※【Load Model】にて学習済みのサンプルを体験できます。
## 実行時の様子
<img width="853" height="547" alt="image" src="https://github.com/user-attachments/assets/e88f4a1c-b00e-4307-9650-5bb9da0338cf" /><br>
＝＝＝<br>
<img width="917" height="941" alt="image" src="https://github.com/user-attachments/assets/ed9307e1-aca2-43b8-910d-5c471d6ef57d" /><br>
＝＝＝<br>
<img width="939" height="818" alt="image" src="https://github.com/user-attachments/assets/348f37f1-0793-4112-a572-87df420026fb" /><br>
＝＝＝<br>
<img width="934" height="496" alt="image" src="https://github.com/user-attachments/assets/88cad7c2-e56d-4d35-af5c-f34873908083" /><br>
