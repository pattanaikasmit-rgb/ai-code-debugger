const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ai-code-debugger.netlify.app', 'https://ai-code-debugger.netlify.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Code Debugger API Server is running!' });
});

// POST /debug route with OpenRouter API integration
app.post('/debug', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    // Validate request body
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Code is required and must be a string'
      });
    }
    
    if (!language || typeof language !== 'string') {
      return res.status(400).json({
        error: 'Language is required and must be a string'
      });
    }

    // Check for OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      return res.status(500).json({
        error: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in .env file'
      });
    }

    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "anthropic/claude-3-haiku",
      messages: [
        {
          role: "user",
          content: `You are an expert programmer. Find errors in the code, explain them, and return corrected code.

Language: ${language}
Code: 
\`\`\`${language}
${code}
\`\`\`

Please analyze the code and respond with a JSON object containing:
- error: description of any errors found (or "No errors found" if code is correct)
- explanation: detailed explanation of the issues and how to fix them
- fixedCode: the corrected version of the code

Respond only with the JSON object, no additional text.`
        }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'AI Code Debugger'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      return res.status(500).json({
        error: 'Failed to parse AI response'
      });
    }

    // Validate response structure
    if (!parsedResponse.error || !parsedResponse.explanation || !parsedResponse.fixedCode) {
      return res.status(500).json({
        error: 'AI response missing required fields'
      });
    }

    res.json({
      success: true,
      analysis: {
        language,
        issues: parsedResponse.error !== "No errors found" ? [{
          line: 1,
          type: 'error',
          message: parsedResponse.error,
          suggestion: parsedResponse.explanation
        }] : [],
        fixes: parsedResponse.error !== "No errors found" ? [{
          line: 1,
          original: code,
          fixed: parsedResponse.fixedCode,
          reason: parsedResponse.explanation
        }] : [],
        explanation: parsedResponse.explanation,
        optimizedCode: parsedResponse.fixedCode
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    
    if (error.response) {
      // OpenRouter API error
      console.error('OpenRouter API error:', error.response.data);
      return res.status(500).json({
        error: 'OpenRouter API error: ' + (error.response.data.error?.message || 'Unknown error')
      });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return res.status(500).json({
        error: 'Failed to connect to OpenRouter API'
      });
    } else {
      // Other error
      console.error('Server error:', error.message);
      return res.status(500).json({
        error: 'Internal server error during code analysis'
      });
    }
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Debug endpoint available at POST /debug`);
});

module.exports = app;
