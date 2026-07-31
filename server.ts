import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

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

  // Server-side Search Grounding endpoint for Latest Sewing & Textile Trends
  app.get('/api/sewing-trends', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      const fallbackTrends = [
        {
          title: 'Modular Techwear & Detachable Pocketry',
          summary: 'DIY sewists are adding waterproof zippers, Fidlock magnetic buckles, and modular attachment panels to everyday jackets and bags.',
          impact: 'Drives high demand for heavy-duty cordura nylon, ripstop, and tactical webbing.',
          keywords: ['Techwear', 'Modular', 'Utility'],
          sourceUrl: 'https://vogue.com/article/fashion-trends',
          sourceTitle: 'Fashion & Utility Apparel Trends'
        },
        {
          title: 'Zero-Waste Sashiko & Upcycled Denim',
          summary: 'Visible mending using Japanese Sashiko geometric stitching is transforming discarded denim into luxury, high-contrast streetwear.',
          impact: 'Praise for 100% fabric utilization and artisanal hand-stitching.',
          keywords: ['Upcycling', 'Sashiko', 'ZeroWaste'],
          sourceUrl: 'https://craftscouncil.org.uk',
          sourceTitle: 'Crafts Council Textile Review'
        },
        {
          title: 'Luminous Fiber-Optics & E-Textiles',
          summary: 'Embedded conductive threads, micro-LED fiber optics, and temperature-reactive dyes are bringing wearable electronics into home garment construction.',
          impact: 'Bridging physical sewing craftsmanship with interactive tech.',
          keywords: ['E-Textiles', 'SolarFiber', 'SmartFabrics'],
          sourceUrl: 'https://textileworld.com',
          sourceTitle: 'Smart Fabrics & E-Textile Innovations'
        }
      ];

      if (!apiKey) {
        console.warn('GEMINI_API_KEY missing. Returning fallback sewing trends.');
        return res.json({ success: true, trends: fallbackTrends, grounded: false });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `Search the web for the latest top 3 current sewing, fashion apparel, and textile design trends.
Return a JSON object with a "trends" array containing exactly 3 items.
Each item in "trends" must be an object with properties:
- "title": concise trend name
- "summary": 1-2 sentence description of what is trending right now
- "impact": why it matters for DIY sewists & garment makers
- "keywords": array of 2-3 short hashtag/tag strings without spaces

Output strictly valid JSON string without markdown wrapper codeblocks. Format:
{
  "trends": [
    {
      "title": "...",
      "summary": "...",
      "impact": "...",
      "keywords": ["..."]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json'
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((c: any) => c.web)
        .filter((w: any) => w && w.uri);

      let trendsData = fallbackTrends;
      if (response.text) {
        try {
          const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (Array.isArray(parsed.trends) && parsed.trends.length > 0) {
            trendsData = parsed.trends.slice(0, 3).map((item: any, idx: number) => ({
              title: item.title || fallbackTrends[idx]?.title || 'Textile Trend',
              summary: item.summary || fallbackTrends[idx]?.summary || '',
              impact: item.impact || fallbackTrends[idx]?.impact || '',
              keywords: Array.isArray(item.keywords) ? item.keywords : ['Trend', 'Fashion'],
              sourceUrl: sources[idx]?.uri || sources[0]?.uri || fallbackTrends[idx]?.sourceUrl,
              sourceTitle: sources[idx]?.title || sources[0]?.title || 'Google Search Grounding'
            }));
          }
        } catch (e) {
          console.error('Failed to parse trends JSON from Gemini:', e);
        }
      }

      return res.json({ success: true, trends: trendsData, grounded: sources.length > 0 });
    } catch (err: any) {
      console.error('Error in /api/sewing-trends:', err);
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
