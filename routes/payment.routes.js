const express = require('express');
const { createOrder, receiveWebHook } = require('../controllers/payment.controller.js')
const router = express()

router.post("/crear-orden", createOrder)

router.post("/webhook", receiveWebHook)

module.exports = router