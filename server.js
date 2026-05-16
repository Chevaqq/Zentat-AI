require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Inisialisasi API Google Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        // Menyusun riwayat percakapan teks murni agar AI mengingat konteks chat
        const contents = [];
        if (history && history.length > 0) {
            history.forEach(msg => {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });
        }
        
        // Memasukkan pesan terbaru dari pengguna
        contents.push({ role: 'user', parts: [{ text: message }] });

        // Memanggil model AI teks murni tercepat (Gemini 2.5 Flash)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Aduh bro, otaknya lagi overload.' });
    }
});

// Menyesuaikan port server untuk lingkungan Codespaces atau lokal
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server AI aktif di port ${PORT}`));
