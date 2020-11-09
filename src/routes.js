const express = require('express');
const routes = express.Router();
const ScheduleController = require('./controllers/ScheduleController');

routes.get('/rules', ScheduleController.index);

routes.get('/rules/:initialDate&:finalDate', ScheduleController.getInterval);

routes.post('/rules', ScheduleController.store);

routes.delete('/rules/:id', ScheduleController.destroy);

module.exports = routes;