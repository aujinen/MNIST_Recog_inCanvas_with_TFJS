/**
 * @license
 * Original work Copyright (c) Google LLC.
 * Modified work Copyright (c) 2025-2026 H.Nishiyama / aujinen
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * This file has been modified from the original Google Codelabs implementation.
 * 
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//MNIST recognition in Canvas with TFJS / English version
//  by H.Nishiyama / aujinen
//     2025/09/24 ver1.0
//     2026-08-05 ver8.1
//  Model architecture
//     https://github.com/aujinen/MNIST_Recog_inCanvas_with_TFJS/blob/main/model-archtecture.pdf
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
  document.getElementById('showDetails').style.visibility = 'hidden';
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
    commentArea.textContent = '↓↓↓　Handwriting input area';
    drawarea.appendChild(commentArea);
    drawCanvas.width = 280;
    drawCanvas.height = 280;
    drawCanvas.style = 'border:1px solid #000; background:#fff; margin:4px;';
    drawarea.appendChild(drawCanvas);
    predictBtn = document.createElement('button');
    predictBtn.textContent = 'Prediction';
    drawarea.appendChild(predictBtn);
    clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
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
    resultDiv.textContent = `Prediction: ${classNames[idx]}`;

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
    const saveFileName = 'downloads://my-mnist-model_' + epochs_val;
    await model.save(saveFileName);
  }
}

export async function loadModelBtn() {
    const jsonUpload = document.getElementById('json-upload');
    const weightsUpload = document.getElementById('weights-upload');
    try {
      model = await tf.loadLayersModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
      alert('Model loaded from files.');
    }
    catch (error) {
      model = null;
      alert('*** Cannot loading from files:' + error);
    }
  if (model == null) {
    ExistModel = false;
  }
  else {
    ExistModel = true;
  }
  document.getElementById('saveModel').style.visibility = 'visible';
  document.getElementById('saveTitle').style.visibility = 'visible';
  document.getElementById('showDetails').style.visibility = 'visible';
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
  document.getElementById('showDetails').style.visibility = 'visible';

  setupDrawArea();
}

async function run() {
  ExistModel = false;
  await mainFlow();
}

// ==============================
// 9. 畳み込みフィルタの可視化　（ver.8.0で追加）
// ==============================
function createConvFilterCanvas(kernel2d, scale = 24) {
  const height = kernel2d.length;
  const width = kernel2d[0].length;
  const flat = kernel2d.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const range = max - min || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width * scale}px`;
  canvas.style.height = `${height * scale}px`;
  canvas.style.imageRendering = 'pixelated';
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = Math.round(255 * (kernel2d[y][x] - min) / range);
      const idx = (y * width + x) * 4;
      imageData.data[idx] = value;
      imageData.data[idx + 1] = value;
      imageData.data[idx + 2] = value;
      imageData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function showConvFilters(layer, maxFilters = 8) {
  const weightsTensor = layer.getWeights()[0];
  const [kh, kw, inChannels, outChannels] = weightsTensor.shape;
  const filters = weightsTensor.transpose([3, 0, 1, 2]).arraySync();
  const showCount = Math.min(outChannels, maxFilters);
  const surface = tfvis.visor().surface({ name: `Conv Filters (${layer.name})[Black:0-White:255 after normalization], first ${maxFilters} filters / ${outChannels} total`, tab: 'Model' });
  tfvis.visor().open();
  tfvis.visor().setActiveTab('Model');
  surface.drawArea.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gridTemplateColumns = `repeat(${showCount}, auto)`;
  wrapper.style.gap = '12px';
  surface.drawArea.appendChild(wrapper);

  for (let i = 0; i < showCount; i++) {
    const kernelSlice = filters[i];
    const channelAverage = [];
    for (let y = 0; y < kh; y++) {
      channelAverage[y] = [];
      for (let x = 0; x < kw; x++) {
        let sum = 0;
        for (let c = 0; c < inChannels; c++) {
          sum += kernelSlice[y][x][c];
        }
        channelAverage[y][x] = sum / inChannels;
      }
    }
    const card = document.createElement('div');
    card.style.textAlign = 'center';
    const label = document.createElement('div');
    label.textContent = `Filter ${i + 1}`;
    label.style.marginBottom = '6px';
    card.appendChild(createConvFilterCanvas(channelAverage));
    card.appendChild(label);
    wrapper.appendChild(card);
  }
}

function showDetailBtn() {
  const maxShowLayers = 5; // 最大表示層数
  if (!model) {
    alert('The model has not been loaded yet.');
    return;
  }
  const convLayers = model.layers.filter(layer => layer.getClassName().toLowerCase().includes('conv2d'));
  if (convLayers.length === 0) {
    alert('The model does not contain any convolutional layers.');
    return;
  }
  for (let i = 0; (i < convLayers.length && i < maxShowLayers); i++) {
    showConvFilters(convLayers[i], 8);
  }
}

// ==============================
// 9. グローバル公開・初期化
// ==============================
window.run = run;
window.saveModelBtn = saveModelBtn;
window.loadModelBtn = loadModelBtn;
window.showDetailBtn = showDetailBtn;

window.onload = () => {
  setupUI();
  // run()は手動実行
};

// ==============================
// 10. ファイル選択UIの更新
// ==============================
const jsonUpload = document.getElementById('json-upload');
const jsonNames = document.getElementById('json-upload-filenames');

if (jsonUpload) {
  jsonUpload.addEventListener('change', () => {
    const files = Array.from(jsonUpload.files).map(f => f.name).join(', ');
    jsonNames.textContent = files || 'No files selected';
  });
}

const weightsUpload = document.getElementById('weights-upload');
const weightsNames = document.getElementById('weights-upload-filenames');

if (weightsUpload) {
  weightsUpload.addEventListener('change', () => {
    const files = Array.from(weightsUpload.files).map(f => f.name).join(', ');
    weightsNames.textContent = files || 'No files selected';
  });
}