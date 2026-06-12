require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Serve static files
app.use('/applicant_documents', express.static(path.join(__dirname, 'applicant_documents')));

// --- ເພີ່ມ Route ພື້ນຖານ ເພື່ອບໍ່ໃຫ້ຂຶ້ນ 404 ເວລາເຂົ້າ http://10.0.200.107:8001/ ---
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to FINA LBB Visa KYC API",
        status: "Online",
        timestamp: new Date()
    });
});

// Routes - ປັບໃຫ້ໃຊ້ path.join ເພື່ອຄວາມປອດໄພໃນ Docker
const routesPath = path.join(__dirname, 'routes');
readdirSync(routesPath).map((routeFile) => 
    app.use('/api', require(path.join(routesPath, routeFile)))
);

const PORT = process.env.PORT || 8001; 

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Basic route: http://localhost:${PORT}/`);
    console.log(`🛠️  API routes start with: http://localhost:${PORT}/api/`);
});