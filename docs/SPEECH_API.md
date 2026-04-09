# Speech API (TTS & STT) – Integration Guide

This doc describes how this frontend calls the speech backend so another app can replicate the same requests and behavior. **English only:** use `language` / locale `en-IN` everywhere below.

---

## Base URL

- All requests go to: **`http://localhost:8080/api/speech/`**  
- Replace with your backend base URL if different.

---

## 1. TTS (Text-to-Speech)

### Endpoint

- **URL:** `POST {base}/speech/tts`  
- **Example:** `POST http://localhost:8080/api/speech/tts`

### Request

- **Method:** `POST`
- **Content-Type:** `multipart/form-data` (use `FormData`).
- **Body (form fields):**

| Field      | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `text`    | string | Yes      | Exact text to synthesize. |
| `language`| string | Yes      | Locale. For English use **`en-IN`**. |

### Example (JavaScript)

```js
const formData = new FormData();
formData.append('text', 'Hello, how can I help you?');
formData.append('language', 'en-IN');

const response = await fetch('http://localhost:8080/api/speech/tts', {
  method: 'POST',
  body: formData
});
```

### Response

- **Success:** `200` with **binary audio** in the response body (e.g. MP3 or WAV; backend decides).
- **Usage:** Read as blob, create object URL, play with `Audio` or `<audio>`:

```js
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new window.Audio(audioUrl);
audio.play();
// Optional: revoke URL when playback ends: URL.revokeObjectURL(audioUrl)
```

- **Error:** Non-2xx status; no special error body contract in this codebase.

---

## 2. STT (Speech-to-Text)

### Endpoint

- **URL:** `POST {base}/speech/stt`  
- **Example:** `POST http://localhost:8080/api/speech/stt`

### Request

- **Method:** `POST`
- **Content-Type:** `multipart/form-data` (use `FormData`).
- **Body (form fields):**

| Field      | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `file`    | file   | Yes      | Audio file (blob). We send as `audio.wav` or `audio.{extension}`. |
| `language`| string | Yes      | Locale. For English use **`en-IN`**. |

- **File name:** We use `audio.wav` or `audio.{extension}` (e.g. `audio.webm`, `audio.mp3`). Backend may accept any name; sending a clear extension helps.

### Example (JavaScript)

```js
const formData = new FormData();
formData.append('file', audioBlob, 'audio.wav');  // or audio.webm, audio.mp3
formData.append('language', 'en-IN');

const response = await fetch('http://localhost:8080/api/speech/stt', {
  method: 'POST',
  body: formData
});
```

### Response

- **Success:** `200` with **plain text** body = transcript (no JSON in our current usage).
- **Usage:** `const text = await response.text();` then use as the user’s input (e.g. put in input field or send as message).
- **Error:** Non-2xx; we treat as failure and show a generic error.

---

## 3. Our recording logic (for STT)

We use this when we **do** call the backend for STT (e.g. Telugu). For **English-only** you can still use the same flow to mimic us.

### 3.1 Start recording

1. Get microphone: `navigator.mediaDevices.getUserMedia({ audio: true })`.
2. Prefer a supported MIME type for `MediaRecorder` (we try, in order):  
   `audio/mpeg`, `audio/webm;codecs=opus`, `audio/ogg;codecs=opus`, `audio/webm`, `audio/ogg`.  
   If none supported, use `new MediaRecorder(stream)` without options.
3. Create `MediaRecorder(stream, { mimeType } optional)`.
4. Collect chunks: `mediaRecorder.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); }`.
5. Call `mediaRecorder.start()`.

### 3.2 Stop recording and send to STT

1. Call `mediaRecorder.stop()`.
2. In `mediaRecorder.onstop`:
   - Build one blob: `new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' })`.
   - (Optional) We then convert to **16 kHz mono WAV** for the backend:
     - Decode with `AudioContext.decodeAudioData`.
     - Mix to mono (average channels).
     - Resample to 16 kHz if needed.
     - Encode as WAV (16-bit PCM) and create a new `Blob` with `type: 'audio/wav'`.
   - Send that blob (or the original) in `FormData` as `file` with name e.g. `audio.wav` or `audio.webm`, plus `language: 'en-IN'`, to `POST .../speech/stt` as above.

### 3.3 English in this app

- In **this** frontend, for **English** we do **not** call the STT API; we use the browser **SpeechRecognition** API with `language: 'en-IN'` and use its transcript. So the backend STT is only required if the other frontend wants to use the same backend for English; the API contract above is unchanged for English (`en-IN`).

---

## 4. Quick reference (English only)

| Feature | Endpoint           | Method | Form body              | Response        |
|--------|--------------------|--------|------------------------|-----------------|
| TTS    | `/api/speech/tts`  | POST   | `text`, `language` = `en-IN` | Binary audio   |
| STT    | `/api/speech/stt`  | POST   | `file` (audio blob), `language` = `en-IN` | Plain text transcript |

- **TTS:** Send text + `en-IN` → play returned audio blob.
- **STT:** Record with `MediaRecorder` → optional convert to 16 kHz mono WAV → send blob + `en-IN` → use returned text.

No code or new endpoints are required on your side beyond what you already have; this is only the API request/response and our recording/TTS logic so the other frontend can mimic it.
