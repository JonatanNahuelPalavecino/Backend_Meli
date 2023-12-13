const express = require('express');
const { createOrder, receiveWebHook } = require('../controllers/payment.controller.js')
const router = express()

router.post("/crear-orden", createOrder)

router.post("/webhook", receiveWebHook)

router.get("/prueba-api", (req, res) => {
    res.send("¡Hola Mundo! Esto es una prueba.")
})

module.exports = router