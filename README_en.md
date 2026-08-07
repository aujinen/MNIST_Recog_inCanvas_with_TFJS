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
<img width="1020" height="679" alt="image001" src="https://github.com/user-attachments/assets/ebb068f0-a612-4442-a64a-4ec556a52a67" /><br>
＝＝＝<br>
<img width="1203" height="734" alt="image002" src="https://github.com/user-attachments/assets/2323e228-26b3-43c9-b0fd-a3514807fa48" /><br>
＝＝＝<br>
<img width="947" height="728" alt="image003" src="https://github.com/user-attachments/assets/69f905af-7958-4845-b423-758bfddcccdc" /><br>
＝＝＝<br>
<img width="954" height="515" alt="image004" src="https://github.com/user-attachments/assets/db20f4e3-ac0e-40f8-bf0c-c6a8a5307593" /><br>
＝＝＝<br>
<img width="948" height="710" alt="image005" src="https://github.com/user-attachments/assets/6d2f5f27-1ba4-41db-9182-cd4c842b9393" /><br>

