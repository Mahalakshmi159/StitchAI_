import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'StitchAI Engine' });
  });

  // Server-side Gemini AI Pattern Generation Endpoint
  app.post('/api/generate-pattern', async (req, res) => {
    try {
      const { prompt, difficulty, fabric, craftStyle, garmentType } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn('GEMINI_API_KEY not set. Using fallback procedural pattern.');
        return res.status(200).json({
          success: false,
          fallback: true,
          message: 'GEMINI_API_KEY environment variable missing. Using client synthesis.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `You are StitchAI, an expert textile engineer and haute-couture digital patternmaker specializing in technical apparel, e-textiles, upcycling, and zero-waste garment construction. Generate a structured JSON response containing exact pattern specifications, assembly steps, and materials for the user's design request.`;

      const userPrompt = `Generate a high-tech garment pattern for a user request:
Prompt: "${prompt || 'Cyberpunk utility garment'}"
Difficulty: ${difficulty || 'intermediate'}
Fabric: ${fabric || 'techwear'}
Craft Style: ${craftStyle || 'embroidery'}
Garment Type: ${garmentType || 'jacket'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tagline: { type: Type.STRING },
              description: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              innovationScore: { type: Type.NUMBER },
              innovationGrade: { type: Type.STRING },
              materials: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              patternSpecs: {
                type: Type.OBJECT,
                properties: {
                  piecesCount: { type: Type.NUMBER },
                  threadGauge: { type: Type.STRING },
                  seamAllowance: { type: Type.STRING },
                  cutDimensions: { type: Type.STRING },
                  recommendedNeedle: { type: Type.STRING }
                },
                required: ['piecesCount', 'threadGauge', 'seamAllowance', 'cutDimensions', 'recommendedNeedle']
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    detail: { type: Type.STRING },
                    techniqueTip: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'title', 'detail', 'techniqueTip']
                }
              }
            },
            required: ['title', 'tagline', 'description', 'estimatedTime', 'innovationScore', 'innovationGrade', 'materials', 'patternSpecs', 'steps']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ success: true, project: parsed });
      } else {
        return res.status(500).json({ success: false, message: 'Empty response from Gemini API' });
      }
    } catch (err: any) {
      console.error('Error calling Gemini API in server:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite development middleware / Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StitchAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
