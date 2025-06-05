require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/docs_config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключение роутов
app.use('/api/films', require('./routes/user/filmRoutes'));
app.use('/api/cinemas', require('./routes/user/cinemaRoutes'));
app.use('/api/sessions', require('./routes/user/sessionRoutes'));
app.use('/api/person', require('./routes/user/personRoutes'));
app.use('/api/filters', require('./routes/user/filterRoutes'));
app.use('/api/bookings', require('./routes/user/bookingRoutes'));

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Успешное подключение к базе данных.');

    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
      console.log(`Swagger UI доступен по адресу http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
  }
}

startServer();