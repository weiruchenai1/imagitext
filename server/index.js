import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json({ limit: '10mb' }));

const fileToBase64 = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  return buffer.toString('base64');
};

const cleanJsonString = (text) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  return cleaned.trim();
};

// SSRF protection: Validate URL and check for private IPs
const isUrlSafe = (urlString) => {
  try {
    const url = new URL(urlString);

    // Only allow HTTPS
    if (url.protocol !== 'https:') {
      return { safe: false, error: 'Only HTTPS URLs are allowed' };
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost and loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
      return { safe: false, error: 'Localhost URLs are not allowed' };
    }

    // Block private IP ranges
    const privateIPPatterns = [
      /^0\./,
      /^10\./,
      /^127\./,
      /^169\.254\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^224\./,
      /^240\./,
      /^255\.255\.255\.255$/
    ];

    for (const pattern of privateIPPatterns) {
      if (pattern.test(hostname)) {
        return { safe: false, error: 'Private IP addresses are not allowed' };
      }
    }

    return { safe: true };
  } catch (error) {
    return { safe: false, error: 'Invalid URL format' };
  }
};

const SYSTEM_PROMPT = `Analyze this image and generate a detailed AI image generation prompt in both English and Chinese.

Return a JSON object with this exact format:
{
  "english": "A detailed English prompt suitable for AI image generation, describing the subject, style, composition, lighting, colors, and mood",
  "chinese": "一个适合AI图像生成的详细中文提示词，描述主体、风格、构图、光影、色彩和氛围"
}

The prompts should be creative, detailed, and capture the essence of the image. Return ONLY the JSON object, without any markdown formatting.`;

app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.' });
    }

    // Validate file size (already limited by multer, but double-check)
    if (req.file.size > 10 * 1024 * 1024) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    const apiKey = process.env.API_KEY;
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

    console.log('=== Image Analysis Request ===');
    console.log('Provider:', provider);
    console.log('Model:', process.env.AI_MODEL);
    console.log('Base URL:', process.env.AI_BASE_URL);
    console.log('API Key prefix:', apiKey?.substring(0, 10) + '...');

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (provider === 'gemini') {
      const baseUrl = process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com';
      const model = process.env.AI_MODEL || 'gemini-2.5-flash';
      const endpoint = `${baseUrl}/v1beta/models/${model}:generateContent`;

      const base64Data = await fileToBase64(req.file.path);

      console.log('Calling Gemini endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT },
              {
                inline_data: {
                  mime_type: req.file.mimetype,
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      await fs.unlink(req.file.path);

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', error);
        return res.status(response.status).json({ error: error.error?.message || 'Gemini API request failed' });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const cleanedText = cleanJsonString(text);
        const parsedResult = JSON.parse(cleanedText);
        return res.json(parsedResult);
      }

      return res.status(500).json({ error: 'Empty response from API' });

    } else if (provider === 'openai') {
      const base64Data = await fileToBase64(req.file.path);
      const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com';

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: SYSTEM_PROMPT },
              {
                type: 'image_url',
                image_url: { url: `data:${req.file.mimetype};base64,${base64Data}` }
              }
            ]
          }]
        })
      });

      await fs.unlink(req.file.path);

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        const cleanedContent = cleanJsonString(content);
        const result = JSON.parse(cleanedContent);
        return res.json(result);
      }

      return res.status(500).json({ error: 'Empty response from API' });
    } else {
      return res.status(500).json({ error: `Unsupported provider: ${provider}` });
    }

  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch((unlinkError) => {
        console.error('Failed to delete uploaded file:', unlinkError);
      });
    }
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// New endpoint: Analyze image from URL
app.post('/api/analyze-image-url', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Validate URL for SSRF protection
    const urlCheck = isUrlSafe(imageUrl);
    if (!urlCheck.safe) {
      return res.status(400).json({ error: urlCheck.error });
    }

    console.log('=== Image Analysis from URL ===');
    console.log('URL:', imageUrl);

    // Fetch the image with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let imageResponse;
    try {
      imageResponse = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ImagiText/1.0'
        }
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout: Image fetch took too long' });
      }
      return res.status(400).json({ error: 'Failed to fetch image from URL' });
    }
    clearTimeout(timeout);

    if (!imageResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch image: HTTP ' + imageResponse.status });
    }

    // Validate content type
    const contentType = imageResponse.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'URL does not point to a valid image' });
    }

    // Check content length (max 10MB)
    const contentLength = imageResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds 10MB limit' });
    }

    // Get image buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate actual size
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds 10MB limit' });
    }

    const base64Data = buffer.toString('base64');
    const mimeType = contentType.split(';')[0].trim();

    const apiKey = process.env.API_KEY;
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Process with AI (same logic as file upload)
    if (provider === 'gemini') {
      const baseUrl = process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com';
      const model = process.env.AI_MODEL || 'gemini-2.5-flash';
      const endpoint = `${baseUrl}/v1beta/models/${model}:generateContent`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', error);
        return res.status(response.status).json({ error: error.error?.message || 'Gemini API request failed' });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const cleanedText = cleanJsonString(text);
        const parsedResult = JSON.parse(cleanedText);
        return res.json(parsedResult);
      }

      return res.status(500).json({ error: 'Empty response from API' });

    } else if (provider === 'openai') {
      const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com';

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: SYSTEM_PROMPT },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64Data}` }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        const cleanedContent = cleanJsonString(content);
        const result = JSON.parse(cleanedContent);
        return res.json(result);
      }

      return res.status(500).json({ error: 'Empty response from API' });
    } else {
      return res.status(500).json({ error: `Unsupported provider: ${provider}` });
    }

  } catch (error) {
    console.error('Error analyzing image from URL:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio, style, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.IMG_GEN_API_KEY || process.env.API_KEY;
    const provider = (process.env.IMG_GEN_PROVIDER || process.env.AI_PROVIDER || 'gemini').toLowerCase();

    console.log('=== Image Generation Request ===');
    console.log('Provider:', provider);
    console.log('Model:', model || process.env.IMG_GEN_MODEL);
    console.log('Base URL:', process.env.IMG_GEN_BASE_URL || process.env.AI_BASE_URL);

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    let fullPrompt = prompt;
    if (style && style !== 'none') {
      fullPrompt = `${prompt}, art style: ${style}, high quality, detailed`;
    }

    if (provider === 'gemini') {
      const baseUrl = process.env.IMG_GEN_BASE_URL || process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com';
      const modelName = model || process.env.IMG_GEN_MODEL || 'gemini-2.5-flash-image-preview';
      const endpoint = `${baseUrl}/v1beta/models/${modelName}:generateContent`;

      console.log('Calling Gemini Image endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini Image Gen Error:', error);
        return res.status(response.status).json({ error: error.error?.message || 'Gemini image generation failed' });
      }

      const data = await response.json();
      const imageData = data.candidates?.[0]?.content?.parts?.find(
        part => part.inlineData || part.inline_data
      );

      if (imageData) {
        const base64Image = imageData.inlineData?.data || imageData.inline_data?.data;
        const mimeType = imageData.inlineData?.mimeType || imageData.inline_data?.mime_type || 'image/png';
        return res.json({
          url: `data:${mimeType};base64,${base64Image}`
        });
      }

      return res.status(500).json({ error: 'No image data in response' });

    } else if (provider === 'openai') {
      const baseUrl = process.env.IMG_GEN_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com';

      let size = "1024x1024";
      if (aspectRatio === '16:9') size = "1792x1024";
      else if (aspectRatio === '9:16') size = "1024x1792";

      const response = await fetch(`${baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || process.env.IMG_GEN_MODEL || 'dall-e-3',
          prompt: fullPrompt,
          n: 1,
          size,
          response_format: 'url'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
      }

      const data = await response.json();
      const imageUrl = data.data?.[0]?.url;

      if (imageUrl) {
        return res.json({ url: imageUrl });
      }

      return res.status(500).json({ error: 'No image URL in response' });

    } else {
      return res.status(500).json({ error: `Unsupported provider: ${provider}` });
    }

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/config', (req, res) => {
  const imgGenModels = process.env.IMG_GEN_MODEL || 'gemini-2.5-flash-image-preview';
  const modelList = imgGenModels.split(',').map(m => m.trim()).filter(Boolean);

  res.json({
    models: modelList,
    defaultModel: modelList[0],
    provider: process.env.IMG_GEN_PROVIDER || process.env.AI_PROVIDER || 'gemini'
  });
});

// ============================================
// 静态文件服务（仅在生产环境）
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

// 检查 public 目录是否存在（Docker 部署时会有）
fs.access(publicPath)
  .then(() => {
    console.log('Serving static files from:', publicPath);

    // 提供静态文件
    app.use(express.static(publicPath));

    // SPA fallback: 所有非 API 路由返回 index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  })
  .catch(() => {
    console.log('Public directory not found. Running in API-only mode.');
  });

app.listen(PORT, () => {
  console.log(`ImagiText server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
