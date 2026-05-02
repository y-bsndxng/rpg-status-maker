import "./style.css";
import { generateCharacter } from "./generator";
import { downloadCanvasAsPng, loadImageFromFile } from "./image";
import { renderCard, renderPlaceholder } from "./renderer";
import type { CharacterCard } from "./types";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("#app が見つかりません。");
}

app.innerHTML = `
  <main class="page">
    <section class="hero">
      <p class="eyebrow">Funny Image Generator</p>
      <h1>RPG Status Maker</h1>
      <p class="description">
        画像をアップロードすると、RPGのキャラクターカード風に加工できます。
      </p>
    </section>

    <section class="controls">
      <label class="file-label">
        <span>画像を選択</span>
        <input id="imageInput" type="file" accept="image/*" />
      </label>

      <button id="generateButton" type="button" disabled>
        ステータス再生成
      </button>

      <button id="downloadButton" type="button" disabled>
        PNG保存
      </button>
    </section>

    <p id="message" class="message">
      まずは画像を選択してください。
    </p>

    <section class="preview">
      <canvas id="cardCanvas" aria-label="RPG status card preview"></canvas>
    </section>
  </main>
`;

const imageInput = document.querySelector<HTMLInputElement>("#imageInput");
const generateButton = document.querySelector<HTMLButtonElement>("#generateButton");
const downloadButton = document.querySelector<HTMLButtonElement>("#downloadButton");
const message = document.querySelector<HTMLParagraphElement>("#message");
const canvas = document.querySelector<HTMLCanvasElement>("#cardCanvas");

if (!imageInput || !generateButton || !downloadButton || !message || !canvas) {
  throw new Error("必要なHTML要素が見つかりません。");
}

let loadedImage: HTMLImageElement | null = null;
let currentCard: CharacterCard | null = null;

renderPlaceholder(canvas);

imageInput.addEventListener("change", async () => {
  const file = imageInput.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    setMessage("画像ファイルを選択してください。");
    return;
  }

  try {
    setMessage("画像を読み込み中です...");

    loadedImage = await loadImageFromFile(file);
    currentCard = generateCharacter();

    renderCard(canvas, loadedImage, currentCard);

    generateButton.disabled = false;
    downloadButton.disabled = false;

    setMessage("カードを生成しました。気に入らなければ再生成できます。");
  } catch (error) {
    console.error(error);
    setMessage("画像の読み込みに失敗しました。別の画像で試してください。");
  }
});

generateButton.addEventListener("click", () => {
  if (!loadedImage) {
    setMessage("先に画像を選択してください。");
    return;
  }

  currentCard = generateCharacter();
  renderCard(canvas, loadedImage, currentCard);

  setMessage("ステータスを再生成しました。");
});

downloadButton.addEventListener("click", () => {
  if (!currentCard) {
    setMessage("先にカードを生成してください。");
    return;
  }

  const timestamp = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replaceAll(".", "-");

  downloadCanvasAsPng(canvas, `rpg-status-card-${timestamp}.png`);
  setMessage("PNGとして保存しました。");
});

function setMessage(text: string): void {
  if (message != null) {
    message.textContent = text;
  }
}