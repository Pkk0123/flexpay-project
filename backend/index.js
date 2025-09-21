// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Vos informations d'API, pour un usage de test seulement !
const FLEXPAY_API_URL = 'http://ip:port/api/rest/v1/paymentService';
const FLEXPAY_CHECK_API_URL = 'http://ip:port/api/rest/v1/check';
const FLEXPAY_API_TOKEN = 'Token d'accès : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJcL2xvZ2luIiwicm9sZXMiOlsiTUVSQ0hBTlQiXSwiZXhwIjoxODE0OTY4NjE5LCJzdWIiOiJhN2YyY2RmY2Q4MGUyYzZhN2MwY2M4MTc5MTlmYzY1ZSJ9.TSU3i4TD9uH5YeQY_x1aM5sMy0eJlH0dvhMsjJDhO3c';
const FLEXPAY_MERCHANT_CODE = 'PAKAD_SERV';
const FLEXPAY_CALLBACK_URL = 'http://test-callback.com'; // Changé pour une URL factice

// Middleware pour analyser le corps des requêtes JSON et permettre les requêtes cross-origin
app.use(cors());
app.use(bodyParser.json());

// Point de terminaison (endpoint) pour gérer les paiements
app.post('/api/pay', async (req, res) => {
    try {
        const { phone, amount, currency } = req.body;
        
        const payload = {
            merchant: FLEXPAY_MERCHANT_CODE,
            type: "1", // 1: mobile money
            reference: `REF-${Date.now()}`,
            phone: phone,
            amount: amount,
            currency: currency,
            callbackUrl: FLEXPAY_CALLBACK_URL
        };

        const response = await fetch(FLEXPAY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FLEXPAY_API_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Erreur du serveur lors du paiement:', error);
        res.status(500).json({ code: '1', message: 'Erreur interne du serveur.' });
    }
});

// Point de terminaison pour vérifier une transaction par son numéro de commande
app.get('/api/check/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        const response = await fetch(`${FLEXPAY_CHECK_API_URL}/${orderNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${FLEXPAY_API_TOKEN}`
            }
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Erreur du serveur lors de la vérification:', error);
        res.status(500).json({ code: '1', message: 'Erreur interne du serveur.' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
