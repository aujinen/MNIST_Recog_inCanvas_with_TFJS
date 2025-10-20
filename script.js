/**
 * @license
 * Copyright 2025 [H.Nishiyama, Niigata-University]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//MNIST recognition in Canvas with TFJS
//  by H.Nishiyama, Niigata Univ. 
//     2025/10/20 ver7.0
//  Based on
//      https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html
//  Ref:
//      https://js.tensorflow.org/api/latest
//      https://qiita.com/yukagil/items/ca84c4bfcb47ac53af99
//      https://qiita.com/niusounds/items/37c1f9b021b62194e077
//  supported by
//      GitHub copilot on VSCode

// ==============================
// 1. 定数・グローバル変数
// ==============================
const classNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let epochs_val = 10;
let model = null;
let ExistModel = false;

// ==============================
// 2. UI初期化
// ==============================
function setupUI() {
  // エポック数入力
  const epochInput = document.getElementById('epoch');
  epochInput.addEventListener('input', (e) => {
    epochs_val = Number(e.target.value);
  });

  // 保存・読込ボタンの初期状態
  document.getElementById('saveModel').style.visibility = 'hidden';
  document.getElementById('saveTitle').style.visibility = 'hidden';
}

// ==============================
// 3. MNISTデータの読み込み・可視化
// ==============================
import { MnistData } from './data.js';

async function showExamples(data) {
  const surface = tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data' });
  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];
  tfvis.visor().open();
  tfvis.visor().setActiveTab('Input Data');
  surface.drawArea.innerHTML = '';

  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs.slice([i, 0], [1, examples.xs.shape[1]]).reshape([28, 28, 1]);
    });
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);
    imageTensor.dispose();
  }
}

// ==============================
// 4. モデル構築・学習
// ==============================
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({
    units: 10,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
}

async function trainModel(model, data) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = { name: 'Model Training', tab: 'Model', styles: { height: '1000px' } };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
  tfvis.visor().open();
  tfvis.visor().setActiveTab('Model');
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 5500;
  const TEST_DATA_SIZE = 1000;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [
      d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [
      d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: epochs_val,
    shuffle: true,
    callbacks: fitCallbacks
  });
}

// ==============================
// 5. 評価・可視化
// ==============================
function doPrediction(model, data, testDataSize = 500) {
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape([testDataSize, 28, 28, 1]);
  const labels = testData.labels.argMax(-1);
  const preds = model.predict(testxs).argMax(-1);
  testxs.dispose();
  return [preds, labels];
}

async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: 'Accuracy', tab: 'Evaluation' };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);
  tfvis.visor().open();
  tfvis.visor().setActiveTab('Evaluation');
  labels.dispose();
}

async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: 'Confusion Matrix', tab: 'Evaluation' };
  tfvis.render.confusionMatrix(container, { values: confusionMatrix, tickLabels: classNames });
  labels.dispose();
}

// ==============================
// 6. 手書き入力エリアのセットアップ
// ==============================
function setupDrawArea() {
  const drawarea = document.getElementById('draw-area');
  let drawCanvas, predictBtn, clearBtn, resultDiv, commentArea;

  if (drawarea.children.length > 0) {
    commentArea = drawarea.querySelector('p');
    drawCanvas = drawarea.querySelector('canvas');
    predictBtn = drawarea.querySelector('button:nth-of-type(1)');
    clearBtn = drawarea.querySelector('button:nth-of-type(2)');
    resultDiv = drawarea.querySelector('div');
  } else {
    drawCanvas = document.createElement('canvas');
    commentArea = document.createElement('p');
    commentArea.textContent = '↓↓↓　手書き文字入力エリア';
    drawarea.appendChild(commentArea);
    drawCanvas.width = 280;
    drawCanvas.height = 280;
    drawCanvas.style = 'border:1px solid #000; background:#fff; margin:4px;';
    drawarea.appendChild(drawCanvas);
    predictBtn = document.createElement('button');
    predictBtn.textContent = '予測';
    drawarea.appendChild(predictBtn);
    clearBtn = document.createElement('button');
    clearBtn.textContent = 'クリア';
    clearBtn.style = 'margin-left:8px;';
    drawarea.appendChild(clearBtn);
    resultDiv = document.createElement('div');
    resultDiv.style = 'margin-top:8px; font-size:20px;';
    drawarea.appendChild(resultDiv);
  }

  // 描画用
  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  drawCanvas.addEventListener('mousedown', e => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });
  drawCanvas.addEventListener('mouseup', e => { drawing = false; });
  drawCanvas.addEventListener('mouseleave', e => { drawing = false; });
  drawCanvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const ctx = drawCanvas.getContext('2d');
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
  });

  // 予測処理
  predictBtn.onclick = async () => {
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const sctx = smallCanvas.getContext('2d');
    sctx.drawImage(drawCanvas, 0, 0, 28, 28);

    let imgData = sctx.getImageData(0, 0, 28, 28);
    let arr = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
      arr.push(1 - imgData.data[i] / 255);
    }
    const input = tf.tensor(arr, [1, 28, 28, 1]);

    const surface = tfvis.visor().surface({ name: 'Check Drawing', tab: 'Check Drawing' });
    tfvis.visor().open();
    tfvis.visor().setActiveTab('Check Drawing');

    const pred = model.predict(input);
    const probs = pred.dataSync();
    const idx = pred.argMax(-1).dataSync()[0];
    resultDiv.textContent = `予測: ${classNames[idx]}`;

    const data = Array.from(probs).map((p, i) => ({ index: classNames[i], value: p }));
    tfvis.render.barchart(surface, data, { width: 400, height: 300, xLabel: 'Class', yLabel: 'Probability', fontSize: 20 });

    input.dispose();
    pred.dispose();
  };

  // クリア処理
  clearBtn.onclick = () => {
    const ctx = drawCanvas.getContext('2d');
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    resultDiv.textContent = '';
    const surface = tfvis.visor().surface({ name: 'Check Drawing', tab: 'Check Drawing' });
    const data = Array.from({ length: 10 }, (_, i) => ({ index: classNames[i], value: 0 }));
    tfvis.render.barchart(surface, data, { width: 400, height: 300, xLabel: 'Class', yLabel: 'Probability', fontSize: 20 });
  };
}

// ==============================
// 7. モデル保存・読込
// ==============================
export async function saveModelBtn() {
  if (ExistModel) {
    await model.save('downloads://my-mnist-model');
  }
}

export async function loadModelBtn() {
  const jsonUpload = document.getElementById('json-upload');
  const weightsUpload = document.getElementById('weights-upload');
  model = await tf.loadLayersModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
  alert('Model loaded from files.');
  ExistModel = true;
  document.getElementById('saveModel').style.visibility = 'visible';
  document.getElementById('saveTitle').style.visibility = 'visible';
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  await mainFlow();
}

// ==============================
// 8. メイン実行フロー
// ==============================
async function mainFlow() {
  const data = new MnistData();
  await data.load();
  await showExamples(data);

  if (!ExistModel) {
    model = createModel();
  }
  tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);
  tfvis.visor().open();
  tfvis.visor().setActiveTab('Model');

  if (!ExistModel) {
    await trainModel(model, data);
  }

  await showAccuracy(model, data);
  await showConfusion(model, data);

  ExistModel = true;
  document.getElementById('saveModel').style.visibility = 'visible';
  document.getElementById('saveTitle').style.visibility = 'visible';

  setupDrawArea();
}

async function run() {
  ExistModel = false;
  await mainFlow();
}

// ==============================
// 9. グローバル公開・初期化
// ==============================
window.run = run;
window.saveModelBtn = saveModelBtn;
window.loadModelBtn = loadModelBtn;

window.onload = () => {
  setupUI();
  // run()は手動実行
};
