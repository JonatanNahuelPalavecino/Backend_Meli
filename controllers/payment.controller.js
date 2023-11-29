const mercadopago = require('mercadopago');
const { generadorIdNuevo, db, cargarOrdenEnDataBase} = require('./funciones.js');
require('dotenv').config();

const sharedData = {
    orderData: null
}

const createOrder = async (req, res) => {

    const dato = JSON.parse(req.body.oc)

    mercadopago.configure({
        access_token: process.env.MERCADOPAGO_TOKEN,
    });

    const preference = {
        items: [
            {
                title: 'JB Premium',
                description: 'Vinos Españoles',
                picture_url: 'https://jbpremium.com.ar/img/logo.png',
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(dato.total)
            }
        ],
        back_urls: {
            success: "http://localhost:3000/pago-realizado",
            failure: "http://localhost:3000/pago-rechazado",
            pending: "http://localhost:3000/pago-pendiente",
        },
        notification_url: 'https://1fdd-2800-810-450-c26-4cbc-2713-cbf4-4a3c.ngrok.io/webhook',
        //auto_return: 'approved'
    };

    try {
        const result = await mercadopago.preferences.create(preference);
        const id = await generadorIdNuevo()
        sharedData.orderData = {
            id: id,
            comprador: dato.comprador,
            carrito: dato.carrito,
            total: dato.total,
            fecha: dato.fecha,
        }
        res.send({
            mp: result.body,
            compraId : id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la orden");
    }
}

const receiveWebHook = async (req, res) => {
    
    const payment = req.query

    try {

        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment['data.id'])
 
            //EL SIGUIENTE IF MUESTRA SI EN DATA ESTA LA CONFIRMACION DEL PAGO, SI ES APROBADO DEBEMOS DE ENVIAR EL MAIL Y ACTUALIZAR LA BASE DE DATOS DE PRODUCTOS Y ORDEN DE COMPRA
            if (data.body.status === "approved") {

                cargarOrdenEnDataBase(sharedData.orderData)

            }  else if (data.body.status === "rejected") {

                console.log("Pago rechazado");

            } else {

                console.log("Pago pendiente");

            }
            console.log("Peticion Web Hook OK");
            res.status(200).end();
        }

    } catch (error) {

        console.log(error);
        return res.sendStatus(500).json({ error: error.message })

    }
}

module.exports = {
    createOrder, 
    receiveWebHook,
};