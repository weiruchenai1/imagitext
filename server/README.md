# ImagiText Backend API

Backend API server for ImagiText - handles all AI service calls and protects API keys.

## Features

- Secure API key management
- Image analysis via Google Gemini / OpenAI
- AI image generation via Gemini / DALL-E 3
- File upload handling
- CORS configuration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in this directory:

```ini
# Server Port
PORT=3001

# Image Analysis API Configuration
API_KEY=your_gemini_or_openai_api_key
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=

# Image Generation API Configuration
IMG_GEN_PROVIDER=gemini
IMG_GEN_API_KEY=your_image_generation_api_key
IMG_GEN_BASE_URL=
IMG_GEN_MODEL=gemini-2.5-flash-image-preview

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Server

```bash
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
```

## API Endpoints

### POST /api/analyze-image

Analyzes an uploaded image and extracts visual descriptions.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "mainSubject": "string",
  "visualDescription": "string",
  "composition": "string",
  "lighting": "string",
  "colorPalette": "string",
  "mood": "string",
  "suggestedPrompt": "string"
}
```

### POST /api/generate-image

Generates an AI image based on a text prompt.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "prompt": "string",
    "aspectRatio": "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
    "style": "string",
    "model": "string"
  }
  ```

**Response:**
```json
{
  "url": "string (data URI or HTTP URL)"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **dotenv**: Environment variable management
- **multer**: File upload handling
- **@google/genai**: Google Gemini SDK

## Security

- API keys are stored server-side only
- File uploads are limited to 10MB
- Uploaded files are automatically deleted after processing
- CORS is configured to allow only specified origins

## License

MIT
