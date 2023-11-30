const express = require('express');
const { createOrder, receiveWebHook, buscarPago } = require('../controllers/payment.controller.js')
const router = express()

router.post("/crear-orden", createOrder)

router.post("/webhook", receiveWebHook)

module.exports = router