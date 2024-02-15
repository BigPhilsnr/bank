const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const { sequelize } = require("./services/databaseService");
const { subscribeToTopics } = require("./services/kafkaService");
const  { startQueueWorker }= require("./services/queueService");

const app = express();
app.use(bodyParser.json());


const balanceRoutes = require("./routes/balanceRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/balance", balanceRoutes);
app.use("/customer", customerRoutes);
app.use("/transaction", transactionRoutes);
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(filePath);
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.sync(); // Sync models with database
  await subscribeToTopics(); // Subscribe to Kafka topics
  await startQueueWorker(); // Start Redis Queue worker
});

module.exports = app;
