# MNIST_Recog_inCanvas_with_TFJS
## Latest demo URL (subject to change)
[Niigata Univ./ HNishiyama/ TFJS_HN / en](https://www5.dent.niigata-u.ac.jp/~nisiyama/TFJS_HN/en)
## When uploading files to the server
Upload the following three files:<br>
index.html<br>
data.js<br>
script.js<br>
## Version information 
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
## Operating environment (device limitations)
Operation is only guaranteed on laptops with at least the specifications designated by the Faculty of Dentistry.<br>
Confirmed to work on Google Chrome and Microsoft Edge.<br>
JavaScript VM operation requires approximately 520 MB of memory (10 epochs) to 3.1 GB (100 epochs).<br>
Note: At present, operation has only been confirmed on PCs. It does not work on mobile devices such as iPhones. (as of 2025/10/22)<br>
## How to run
The status display window shown on the right side can be opened and closed with the [@] key.<br>
The [Space] key toggles between full-screen display and minimized display.<br>
=== Run procedure ===</p>
● You can set the number of epochs between 1 and 100.<br>
After setting the number of epochs, click the [Train] button.<br>
Training progress will be displayed on the right.<br>
After training is complete, draw any character in the handwritten input area.<br>
Click the [Predict] button to display the recognition result.<br>
Click the [Clear] button to clear the drawing area.<br>
●To save the trained model…<br>
　⇒ Click the [Save Model] button.<br>
　　Two files need to be downloaded, so if a browser alert appears, please allow it.<br>
　　The file names are “my-mnist-model_###.json” and “my-mnist-model_###.weights.bin”.<br>
　　Contains the number of epochs as ###.<br>
　　The model files are common, but due to the specifications, they are saved with different names that include the number of epochs.<br>
●To load a saved model…<br>
　⇒ Select the model file in JSON format and the parameter file in BIN format, then click the [Load Model] button.<br>
　　As a sample, you can also load a model and parameters trained with the corresponding epoch number from the folders 1 through 100.<br>
## Using the pre-trained sample parameters
Sample parameters (.bin) trained at each epoch count with the model file (.json) are placed in the subfolders 1 through 100.<br>
You can try the pre-trained samples using [Load Model].<br>
## What it looks like when running
<img width="711" height="729" alt="image01" src="https://github.com/user-attachments/assets/d0fb65dc-17c2-45e3-a71e-2a5af0bd100b" /><br>
＝＝＝<br>
<img width="893" height="832" alt="image02" src="https://github.com/user-attachments/assets/79be0c0f-a245-484b-85a8-c00f3b0610f2" /><br>
＝＝＝<br>
<img width="922" height="746" alt="image03" src="https://github.com/user-attachments/assets/47dcb0ae-4630-44c2-962f-a9a70822abdf" /><br>
＝＝＝<br>
<img width="859" height="510" alt="image04" src="https://github.com/user-attachments/assets/e9653221-e110-4a2e-b097-ba9954502793" /><br>
＝＝＝<br>
<img width="910" height="827" alt="image05" src="https://github.com/user-attachments/assets/91d05fdb-1890-4ca0-bad2-610299f9ee68" /><br>

