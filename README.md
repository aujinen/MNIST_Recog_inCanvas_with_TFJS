# MNIST_Recog_inCanvas_with_TFJS
  by H.Nishiyama, Niigata Univ. <br>
     2025/10/20 ver7.0<br>
  Based on<br>
      https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html<br>
  Ref:<br>
      https://js.tensorflow.org/api/latest<br>
      https://qiita.com/yukagil/items/ca84c4bfcb47ac53af99<br>
      https://qiita.com/niusounds/items/37c1f9b021b62194e077<br>
  supported by<br>
      GitHub copilot on VSCode<br>

※現状PCでのみ動作確認済み。iPhone等では上手く動きません。（2025/10/20現在）<br>
<br>
●エポック数（epochs）を1〜100の範囲で設定できます。<br>
エポック数を設定後、【学習実行】ボタンをクリックして下さい。<br>
右側に学習の進捗状況が表示されます。<br>
学習終了後、手書き文字入力エリアに任意の文字を描いてください。<br>
【予測】ボタンをクリックすると、認識結果が表示されます。<br>
【クリア】ボタンをクリックすると描画エリアがクリアされます。<br>
<br>
●学習後のモデルを保存する場合・・・<br>
⇒ 【Save Model】ボタンをクリックしてください。<br>
<br>
●保存されたモデルを読み込む場合・・・<br>
⇒ json形式のモデルファイルとbin形式のパラメータファイルを選択し、<br>
【Load Model】ボタンをクリックしてください。<br>
