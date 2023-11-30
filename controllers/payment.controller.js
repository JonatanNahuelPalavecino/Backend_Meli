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
            success: "http://localhost:3000/redireccionando",
            failure: "http://localhost:3000/redireccionando",
            pending: "http://localhost:3000/redireccionando",
        },
        notification_url: 'https://1779-2800-810-450-c26-e4b4-36a5-cf7c-9029.ngrok.io/webhook',
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
            transaccion: null,
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

            sharedData.orderData.transaccion = {
                transaccion_id: data.body.id,
                tarjeta: data.body.payment_method_id,
                tipoDeTarjeta: data.body.payment_type_id,
                estado: data.body.status,
                detalleDelPago: data.body.status_detail,
                pagoRecibido: data.body.transaction_details.net_received_amount,
                pagoBruto: data.body.transaction_details.total_paid_amount,
            }
 
            //EL SIGUIENTE IF MUESTRA SI EN DATA ESTA LA CONFIRMACION DEL PAGO, SI ES APROBADO DEBEMOS DE ENVIAR EL MAIL Y ACTUALIZAR LA BASE DE DATOS DE PRODUCTOS Y ORDEN DE COMPRA
            if (data.body.status === "approved") {

                //cargarOrdenEnDataBase(sharedData.orderData)
                console.log(sharedData.orderData)
                console.log("Pago aprobado");
            }  else if (data.body.status === "rejected") {

                console.log("Pago rechazado");

            } else {

                console.log("Pago pendiente");

            }

        } else {
            console.log("No es un Hook de tipo payment");
        }
        return res.status(200).send('OK');

    } catch (error) {
        console.log(error);
        return res.sendStatus(500).json({ error: error.message })
    }
}

module.exports = {
    createOrder, 
    receiveWebHook
};