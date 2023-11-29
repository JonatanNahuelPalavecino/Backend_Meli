const express = require('express');
const { createOrder, receiveWebHook, handleEventSourceConnection } = require('../controllers/payment.controller.js')
const router = express()

router.post("/crear-orden", createOrder)

router.get("/success", (req, res) => res.send("Success!"))

router.get("/failure", (req, res) => res.send("Failure!"))

router.get("/pending", (req, res) => res.send("Pending!"))

router.post("/webhook", receiveWebHook)

module.exports = router