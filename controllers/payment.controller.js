const mercadopago = require('mercadopago');
const { generadorIdNuevo, cargarOrdenEnDataBase} = require('./funciones.js');
const {enviarEmailCliente, enviarEmailUsuario} = require('./enviarMails.js')
require('dotenv').config();

const sharedData = {
    orderData: null
}

const createOrder = async (req, res) => {

    const dato = JSON.parse(req.body.oc)

    const client = new mercadopago.MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_TOKEN, options: { timeout: 5000, idempotencyKey: process.env.IDEMPOTENCY } });

    const preference = new mercadopago.Preference(client);

    const body = {
        items: [
            {
                title: 'JB Premium',
                description: 'Vinos Españoles',
                picture_url: 'https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc',
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
        //auto_return: 'all',
        notification_url: 'https://19f4-2800-810-450-c26-993c-653e-37e3-a97.ngrok-free.app/webhook',
        payment_methods: {
            excluded_payment_methods: [],
            excluded_payment_types: [
                {
                id: "ticket"
                }
            ],
            installments: 12
        },
    }

    try {
        const result = await preference.create( {body} );
        const id = await generadorIdNuevo()
        sharedData.orderData = {
            id: id,
            comprador: dato.comprador,
            carrito: dato.carrito,
            total: dato.total,
            fecha: dato.fecha,
        }
        res.send({
            mp: result,
            compraId : id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la orden");
    }
}

const receiveWebHook = async (req, res) => {
    const payment = req.query;

    try {
        if (payment.type === "payment") {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment['data.id']}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}`,
                }
            });

            if (response.ok) {
                const data = await response.json();

                sharedData.orderData.transaccion = {
                    transaccion_id: data.id,
                    tarjeta: data.payment_method_id,
                    tipoDeTarjeta: data.payment_type_id,
                    estado: data.status,
                    detalleDelPago: data.status_detail,
                    pagoRecibido: data.transaction_details.net_received_amount,
                    pagoBruto: data.transaction_details.total_paid_amount,
                }
                
                if (data.status === "approved") {
                    cargarOrdenEnDataBase(sharedData.orderData)
                    enviarEmailCliente(sharedData.orderData)
                    enviarEmailUsuario(sharedData.orderData)
                    console.log("Pago aprobado");
                }  else if (data.status === "rejected") {
                    enviarEmailUsuario(sharedData.orderData)
                    console.log("Pago rechazado");
                } else {
                    enviarEmailCliente(sharedData.orderData)
                    enviarEmailUsuario(sharedData.orderData)
                    console.log("Pago pendiente");
                }
            } else {
                console.error(`Error al obtener la compra: ${response.status} - ${response.statusText}`);
            }
        } else {
            console.log("No es un Hook de tipo payment");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
    return res.status(200).send('OK');
}

module.exports = {
    createOrder, 
    receiveWebHook,
};