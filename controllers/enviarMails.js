require('dotenv').config();
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_KEY)

const enviarEmailCliente = async (e) => {
    const carritoItems = Object.values(e.carrito);

    const productosEnCarrito = carritoItems.map((item, index) => {
        return `
            <p style="font-weight: bold; color: #0066cc;">Producto N° ${index + 1}:</p>
            <ul>
                <li>Vino: ${item.nombre}</li>
                <li>Cantidad: ${item.cantidad}</li>
                <li>Precio: $${item.precioActualizado}</li>
            </ul>
            `;
    }).join('\n');

    const contenidoCorreo = `
    <div style="background-color: #f4f4f4; padding: 20px;">
        <p style="color: #333; font-size: 18px;">Realizaste una venta a través de la página JB Premium!</p>

        <p>A continuación, te detallamos todo lo necesario para preparar el pedido, verifiques el total contra la acreditación de Mercado Pago (*) y los datos del comprador para el retiro o envío. Recuerda contactarte para coordinar. Ten en cuenta que tienes una promoción en la que el envío es gratis a Capital Federal y la compra debe ser de $20,000 o más.</p>

        <p style="font-weight: bold; color: #0066cc;">Datos del comprador:</p>
        <ul>
            <li>Nombre: ${e.comprador.nombreIngresado}</li>
            <li>Apellido: ${e.comprador.apellidoIngresado}</li>
            <li>Nombre de la Empresa: ${e.comprador.nombreEmpresaIngresado}</li>
            <li>Email: ${e.comprador.emailIngresado}</li>
            <li>Teléfono: ${e.comprador.telefonoIngresado}</li>
        </ul>

        <p style="font-weight: bold; color: #0066cc;">Datos del Envío:</p>
        <ul>
            <li>Dirección: ${e.comprador.direccionIngresada}</li>
            <li>Localidad: ${e.comprador.localidadIngresada}</li>
            <li>Provincia: ${e.comprador.provinciaIngresada}</li>
            <li>Código Postal: ${e.comprador.codigoPostalIngresado}</li>
        </ul>

        <p style="font-weight: bold; color: #0066cc;">Datos de la Compra:</p>
        ${productosEnCarrito}

        <p><strong>ID de la Compra:</strong> ${e.id}</p>
        <p><strong>N° de operación Mercado Pago:</strong> ${e.transaccion.transaccion_id}</p>
        <p><strong>Total de la Compra:</strong> $${e.total}</p>
        <p><strong>Fecha de la Compra:</strong> ${e.fecha}</p>

        <p style="font-weight: bold; color: #0066cc;">Mensaje automático de JB Premium.</p>

        <p>(*) Constatar total depositado + email en MercadoPago contra el detalle de este correo para confirmar que el pago y la orden de compra son del mismo cliente.</p>
    </div>
`;

    const msg = {
        to: "jnpr1992@gmail.com",
        from: {
            email: 'jnpr1992@gmail.com',
            name: 'Info - JB Premium',
        },
        subject: `JB Premium - Nueva orden de compra N° ${e.id}`,
        html: contenidoCorreo,
    };

    try {
        await sgMail.send(msg);
        console.log('Correo electrónico enviado al cliente correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico al cliente:', error.response.body);
    }
};

const enviarEmailUsuario = async (e) => {
    const carritoItems = Object.values(e.carrito);

    const productosEnCarrito = carritoItems.map((item, index) => {
        return `
            <p style="font-weight: bold; color: #0066cc;">Producto N° ${index + 1}:</p>
            <ul>
                <li>Vino: ${item.nombre}</li>
                <li>Cantidad: ${item.cantidad}</li>
                <li>Precio: $${item.precioActualizado}</li>
            </ul>
            `;
    }).join('\n');

    const contenidoCorreo = `
    <div style="background-color: #f4f4f4; padding: 20px;">
        <p style="color: #333; font-size: 18px;">Realizaste una compra a través de la página JB Premium!</p>

        <p>A continuación, te detallamos toda la informacion relevante de tu pedido. Personal de JB Premium se pondrá en contacto contigo para el envío.</p>

        <p style="font-weight: bold; color: #0066cc;">Datos del comprador:</p>
        <ul>
            <li>Nombre: ${e.comprador.nombreIngresado}</li>
            <li>Apellido: ${e.comprador.apellidoIngresado}</li>
            <li>Nombre de la Empresa: ${e.comprador.nombreEmpresaIngresado}</li>
            <li>Email: ${e.comprador.emailIngresado}</li>
            <li>Teléfono: ${e.comprador.telefonoIngresado}</li>
        </ul>

        <p style="font-weight: bold; color: #0066cc;">Datos del Envío:</p>
        <ul>
            <li>Dirección: ${e.comprador.direccionIngresada}</li>
            <li>Localidad: ${e.comprador.localidadIngresada}</li>
            <li>Provincia: ${e.comprador.provinciaIngresada}</li>
            <li>Código Postal: ${e.comprador.codigoPostalIngresado}</li>
        </ul>

        <p style="font-weight: bold; color: #0066cc;">Datos de la Compra:</p>
        ${productosEnCarrito}

        <p><strong>ID de la Compra:</strong> ${e.id}</p>
        <p><strong>N° de operación Mercado Pago:</strong> ${e.transaccion.transaccion_id}</p>
        <p><strong>Total de la Compra:</strong> $${e.total}</p>
        <p><strong>Fecha de la Compra:</strong> ${e.fecha}</p>

        <p style="font-weight: bold; color: #0066cc;">Mensaje automático de JB Premium.</p>

        <p>Si tenes alguna duda o consulta con respecto a tu pedido, no dudes en responder este mail y en breve te contactaremos.</p>

        <p style="font-weight: bold; color: #0066cc;">JB Premium - Vinos Españoles.</p>
    </div>
`;

    const msg = {
        to: e.comprador.emailIngresado,
        from: {
            email: 'jnpr1992@gmail.com',
            name: 'Info - JB Premium',
        },
        subject: `Felicitaciones! Tu compra N° ${e.id} fue realizada con exito!`,
        html: contenidoCorreo,
    };

    try {
        await sgMail.send(msg);
        console.log('Correo electrónico enviado al usuario correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico al usuario:', error.response.body);
    }
};

module.exports = {
    enviarEmailCliente,
    enviarEmailUsuario
}