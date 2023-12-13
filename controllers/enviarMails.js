require('dotenv').config();
const sgMail = require("@sendgrid/mail");
const { obtenerDescripcionRechazo } = require('./funciones');

sgMail.setApiKey(process.env.SENDGRID_KEY)

const enviarEmailCliente = async (e) => {
    const carritoItems = Object.values(e.carrito);

    const productosEnCarrito = carritoItems.map((item, index) => {
        return `       
            <p style="font-size: 1.1rem; font-weight: bold;">Producto N° ${index + 1}:</p>
            <ul style="list-style-type: none; text-align: center; padding: 0;">
                <li style="font-size: 1.1rem; margin: .5rem;"><strong>Vino: </strong>${item.nombre}</li>
                <li style="font-size: 1.1rem; margin: .5rem;"><strong>Cantidad: </strong>${item.cantidad}</li>
                <li style="font-size: 1.1rem; margin: .5rem;"><strong>Precio: </strong>$${item.precioActualizado.toFixed(2)}</li>
            </ul>
            <hr>
            `;
    }).join('\n');

    if (e.transaccion.estado === "approved") {

        const contenidoCorreo = `
        <div style="background-color: #693636; padding: 1rem;">
            <div style="background-color: #f4f4f4; max-width: 100%; padding: 1rem; border-radius: 25px; text-align: center; position: relative; overflow: hidden;">
                <img style="width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc" alt="logojbpremium">
                <p style="font-size: 1.5rem; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: bold; text-align: center;">Realizaste una venta a través de la página JB Premium!</p>
                <hr style="width: 100%; height: 5px; background-color: #693636; border: none;">
        
                <p style="font-style: italic; text-align: center; font-size: 1.2rem;">A continuación, te detallamos todo lo necesario para preparar el pedido, verifiques la información de este mail contra la acreditación de Mercado Pago (*) y los datos del comprador para el retiro o envío. Recuerda contactarte para coordinar. <strong>Ten en cuenta que tienes una promoción en la que el envío es gratis a Capital Federal y la compra debe ser de $20,000 o más.</strong></p>
        
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del comprador:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre: </strong>${e.comprador.nombreIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Apellido: </strong>${e.comprador.apellidoIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre de la Empresa: </strong>${e.comprador.nombreEmpresaIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Email: </strong>${e.comprador.emailIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Teléfono: </strong>${e.comprador.telefonoIngresado}</li>
                    </ul>
                </div>
    
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del Envío:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Dirección: </strong>${e.comprador.direccionIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Localidad: </strong>${e.comprador.localidadIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Provincia: </strong>${e.comprador.provinciaIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Codigo Postal: </strong>${e.comprador.codigoPostalIngresado}</li>
                    </ul>
                </div>
                
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Compra:</p>
                    <hr>
                    ${productosEnCarrito}
                </div>
    
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Venta:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>ID de la Compra: </strong>${e.id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>N° de operación de Mercado Pago: </strong>${e.transaccion.transaccion_id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Total de la Compra: </strong>$${e.total.toFixed(2)}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Total Acreditado de la Compra: </strong>$${e.transaccion.pagoRecibido}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Tarjeta: </strong>${e.transaccion.tarjeta}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Tipo de tarjeta: </strong>${e.transaccion.tipoDeTarjeta}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Status del pago: </strong>${e.transaccion.estado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Detalle del pago: </strong>${e.transaccion.detalleDelPago}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Fecha de la Compra: </strong>${e.fecha}</li>
                    </ul>
                </div>
                
                <p style="font-style: italic; text-align: center; font-size: 1.2rem; z-index: 1; position: relative;">(*) Constatar El N° de operación de Mercado Pago, Total de la Compra y Total Acreditado informado en este mail, contra el movimiento de Mercado Pago.</p>
                
                <div style="position: relative; margin: 2rem auto; max-width: 300px; z-index: 1; background-color: white; border-radius: 25px; padding: 5px 0;">
                <a style="text-decoration: none; color: black;" href="https://portafolio-jonatan-palavecino.vercel.app/" target="_blank" rel="noopener noreferrer">
                <p style="margin: 3px;">Desarrollado por Jonatan Palavecino</p>
                <img style="width: 30px;" src="https://portafolio-jonatan-palavecino.vercel.app/images/logo%20portafolio.png" alt="logoportafolio">
                </a>
                </div>
                
                <p style="font-weight: bold; z-index: 1; position: relative; margin: 2rem;">Mensaje automático del sistema de JB Premium.</p>
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
            console.error('Error al enviar el correo electrónico al cliente:', error);
        }
        
    } else {

        const contenidoCorreo = `
        <div style="background-color: #693636; padding: 1rem;">
            <div style="background-color: #f4f4f4; max-width: 100%; padding: 1rem; border-radius: 25px; text-align: center; position: relative; overflow: hidden;">
                <img style="width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc" alt="logojbpremium">
                <p style="font-size: 1.5rem; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: bold; text-align: center;">Realizaste una venta a través de la página JB Premium!</p>
                <hr style="width: 100%; height: 5px; background-color: #693636; border: none;">
        
                <div style="background-color: rgba(200, 105, 32, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <strong style="text-align: center; font-size: 1.3rem; z-index: 1; position: relative;">ATENCION</strong>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;">Mercado Pago informa que el estado del pago es <strong>PENDIENTE</strong>. Revisa si te ingresó el dinero en la cuenta.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">Cabe destacar que puede tardar hasta 2hs en acreditarse.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">Contactate con el cliente y verifica si tiene el comprobante de pago confirmado.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">Caso contrario, ofrecele volver a comprar por la web, o abonar por fuera de la página.</li>
                    </ul>
                </div>

                <p style="font-style: italic; text-align: center; font-size: 1.2rem;">A continuación, te detallamos todo lo necesario para preparar el pedido, verifiques la información de este mail contra la acreditación de Mercado Pago (*) y los datos del comprador para el retiro o envío. Recuerda contactarte para coordinar. <strong>Ten en cuenta que tienes una promoción en la que el envío es gratis a Capital Federal y la compra debe ser de $20,000 o más.</strong></p>
        
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del comprador:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre: </strong>${e.comprador.nombreIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Apellido: </strong>${e.comprador.apellidoIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre de la Empresa: </strong>${e.comprador.nombreEmpresaIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Email: </strong>${e.comprador.emailIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Teléfono: </strong>${e.comprador.telefonoIngresado}</li>
                    </ul>
                </div>

                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del Envío:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Dirección: </strong>${e.comprador.direccionIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Localidad: </strong>${e.comprador.localidadIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Provincia: </strong>${e.comprador.provinciaIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Codigo Postal: </strong>${e.comprador.codigoPostalIngresado}</li>
                    </ul>
                </div>
                
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Compra:</p>
                    <hr>
                    ${productosEnCarrito}
                </div>

                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Venta:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>ID de la Compra: </strong>${e.id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>N° de operación de Mercado Pago: </strong>${e.transaccion.transaccion_id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Total de la Compra: </strong>$${e.total.toFixed(2)}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Total Acreditado de la Compra: </strong>$${e.transaccion.pagoRecibido}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Tarjeta: </strong>${e.transaccion.tarjeta}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Tipo de tarjeta: </strong>${e.transaccion.tipoDeTarjeta}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Status del pago: </strong>${e.transaccion.estado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Detalle del pago: </strong>${e.transaccion.detalleDelPago}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Fecha de la Compra: </strong>${e.fecha}</li>
                    </ul>
                </div>
                
                <p style="font-style: italic; text-align: center; font-size: 1.2rem; z-index: 1; position: relative;">(*) Constatar El N° de operación de Mercado Pago, Total de la Compra y Total Acreditado informado en este mail, contra el movimiento de Mercado Pago.</p>
                
                <div style="position: relative; margin: 2rem auto; max-width: 300px; z-index: 1; background-color: white; border-radius: 25px; padding: 5px 0;">
                    <a style="text-decoration: none; color: black;" href="https://portafolio-jonatan-palavecino.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <p style="margin: 3px;">Desarrollado por Jonatan Palavecino</p>
                        <img style="width: 30px;" src="https://portafolio-jonatan-palavecino.vercel.app/images/logo%20portafolio.png" alt="logoportafolio">
                    </a>
                </div>
                
                <p style="font-weight: bold; z-index: 1; position: relative; margin: 2rem;">Mensaje automático del sistema de JB Premium.</p>
            </div>
        </div>
        `;
    
        const msg = {
            to: "jnpr1992@gmail.com",
            from: {
                email: 'jnpr1992@gmail.com',
                name: 'Info - JB Premium',
            },
            subject: `JB Premium - Nueva orden de compra N° ${e.id} - ACREDITACIÓN PENDIENTE`,
            html: contenidoCorreo,
        };

        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado al cliente correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico al cliente:', error);
        }

    }
};

const enviarEmailUsuario = async (e) => {
    const carritoItems = Object.values(e.carrito);

    const productosEnCarrito = carritoItems.map((item, index) => {
        return `       
        <p style="font-size: 1.1rem; font-weight: bold;">Producto N° ${index + 1}:</p>
        <ul style="list-style-type: none; text-align: center; padding: 0;">
            <li style="font-size: 1.1rem; margin: .5rem;"><strong>Vino: </strong>${item.nombre}</li>
            <li style="font-size: 1.1rem; margin: .5rem;"><strong>Cantidad: </strong>${item.cantidad}</li>
            <li style="font-size: 1.1rem; margin: .5rem;"><strong>Precio: </strong>$${item.precioActualizado.toFixed(2)}</li>
        </ul>
        <hr>
            `;
    }).join('\n');

    if (e.transaccion.estado === "approved") {

        const contenidoCorreo = `
        <div style="background-color: #693636; padding: 1rem;">
            <div style="background-color: #f4f4f4; max-width: 100%; padding: 1rem; border-radius: 25px; text-align: center; position: relative; overflow: hidden;">
                <img style="width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc" alt="logojbpremium">
                <p style="font-size: 1.5rem; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: bold; text-align: center;">Realizaste una compra a través de la página JB Premium!</p>
                <hr style="width: 100%; height: 5px; background-color: #693636; border: none;">
    
                <p style="font-style: italic; text-align: center; font-size: 1.2rem;">A continuación, te detallamos toda la informacion relevante de tu pedido. Personal de JB Premium se pondrá en contacto contigo para el envío.</p>
        
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del comprador:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre: </strong>${e.comprador.nombreIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Apellido: </strong>${e.comprador.apellidoIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre de la Empresa: </strong>${e.comprador.nombreEmpresaIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Email: </strong>${e.comprador.emailIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Teléfono: </strong>${e.comprador.telefonoIngresado}</li>
                    </ul>
                </div>
    
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del Envío:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Dirección: </strong>${e.comprador.direccionIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Localidad: </strong>${e.comprador.localidadIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Provincia: </strong>${e.comprador.provinciaIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Codigo Postal: </strong>${e.comprador.codigoPostalIngresado}</li>
                    </ul>
                </div>
                
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Compra:</p>
                    <hr>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>ID de la Compra: </strong>${e.id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>N° de operación de Mercado Pago: </strong>${e.transaccion.transaccion_id}</li>
                    </ul>
                    <hr>
                    ${productosEnCarrito}
                    <p style="font-size: 1.1rem; margin: .5rem;"><strong>Total de la Compra: </strong>$${e.total.toFixed(2)}</p>
                    <p style="font-size: 1.1rem; margin: .5rem;"><strong>Fecha de la Compra: </strong>${e.fecha}</p>
                </div>
                
                <p style="font-style: italic; text-align: center; font-size: 1.2rem; z-index: 1; position: relative;">Si tenes alguna duda o consulta con respecto a tu pedido, no dudes en responder este mail y en breve te contactaremos.</p>
                
                <div style="position: relative; margin: 2rem auto; max-width: 300px; z-index: 1; background-color: white; border-radius: 25px; padding: 5px 0;">
                <a style="text-decoration: none; color: black;" href="https://portafolio-jonatan-palavecino.vercel.app/" target="_blank" rel="noopener noreferrer">
                <p style="margin: 3px;">Desarrollado por Jonatan Palavecino</p>
                <img style="width: 30px;" src="https://portafolio-jonatan-palavecino.vercel.app/images/logo%20portafolio.png" alt="logoportafolio">
                </a>
                </div>
                
                <p style="font-weight: bold; z-index: 1; position: relative; margin: 2rem;">Mensaje automático del sistema de JB Premium.</p>
            </div>
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
            console.error('Error al enviar el correo electrónico al usuario:', error);
        }

    } else if (e.transaccion.estado === "rejected") {

        const contenidoCorreo = `
        <div style="background-color: #693636; padding: 1rem;">
            <div style="background-color: #f4f4f4; max-width: 100%; padding: 1rem; border-radius: 25px; text-align: center; position: relative; overflow: hidden;">
                <img style="width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc" alt="logojbpremium">
                <p style="font-size: 1.5rem; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: bold; text-align: center;">El pago de tu orden de compra fue rechazado.</p>
                <hr style="width: 100%; height: 5px; background-color: #693636; border: none;">
    
                <p style="font-style: italic; text-align: center; font-size: 1.2rem;">Lamentamos informarte que el pago de tus productos fue rechazado por Mercado Pago. A continuación, te informamos los motivos.</p>
                
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Compra:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>ID de la Compra: </strong>${e.id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>N° de operación de Mercado Pago: </strong>${e.transaccion.transaccion_id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Motivo del rechazo: </strong>${obtenerDescripcionRechazo(e.transaccion.detalleDelPago)}</li>
                    </ul>
                </div>
                
                <p style="font-style: italic; text-align: center; font-size: 1.2rem; z-index: 1; position: relative;">Pero no te preocupes! Te invitamos a realizar nuevamente la orden de compra desde nuestra web con otro medio de pago.</p>
                
                <div style="position: relative; margin: 2rem auto; max-width: 300px; z-index: 1; background-color: white; border-radius: 25px; padding: 5px 0;">
                <a style="text-decoration: none; color: black;" href="https://portafolio-jonatan-palavecino.vercel.app/" target="_blank" rel="noopener noreferrer">
                <p style="margin: 3px;">Desarrollado por Jonatan Palavecino</p>
                <img style="width: 30px;" src="https://portafolio-jonatan-palavecino.vercel.app/images/logo%20portafolio.png" alt="logoportafolio">
                </a>
                </div>
                
                <p style="font-weight: bold; z-index: 1; position: relative; margin: 2rem;">Mensaje automático del sistema de JB Premium.</p>
            </div>
        </div>
        `;
    
        const msg = {
            to: e.comprador.emailIngresado,
            from: {
                email: 'jnpr1992@gmail.com',
                name: 'Info - JB Premium',
            },
            subject: `El pago de tu compra N° ${e.id} fue Rechazado.`,
            html: contenidoCorreo,
        };
        
        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado al usuario correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico al usuario:', error);
        }

    } else {

        const contenidoCorreo = `
        <div style="background-color: #693636; padding: 1rem;">
            <div style="background-color: #f4f4f4; max-width: 100%; padding: 1rem; border-radius: 25px; text-align: center; position: relative; overflow: hidden;">
                <img style="width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/jb-premium.appspot.com/o/logo.png?alt=media&token=d7b19b53-95e5-42e0-b371-d9628ae1c6fc" alt="logojbpremium">
                <p style="font-size: 1.5rem; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: bold; text-align: center;">Realizaste una compra a través de la página JB Premium!</p>
                <hr style="width: 100%; height: 5px; background-color: #693636; border: none;">

                <p style="font-style: italic; text-align: center; font-size: 1.2rem;">A continuación, te detallamos toda la informacion relevante de tu pedido. Personal de JB Premium se pondrá en contacto contigo para el envío.</p>
        
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del comprador:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre: </strong>${e.comprador.nombreIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Apellido: </strong>${e.comprador.apellidoIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Nombre de la Empresa: </strong>${e.comprador.nombreEmpresaIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Email: </strong>${e.comprador.emailIngresado}</li>
                        <li style="font-size: 1.1rem; margin: .5rem; text-align: center;"><strong>Teléfono: </strong>${e.comprador.telefonoIngresado}</li>
                    </ul>
                </div>

                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos del Envío:</p>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Dirección: </strong>${e.comprador.direccionIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Localidad: </strong>${e.comprador.localidadIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Provincia: </strong>${e.comprador.provinciaIngresada}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>Codigo Postal: </strong>${e.comprador.codigoPostalIngresado}</li>
                    </ul>
                </div>
                
                <div style="background-color: rgba(128, 128, 128, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <p style="font-weight: bold; font-size: 1.2rem; text-align: center; text-decoration: underline;">Datos de la Compra:</p>
                    <hr>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>ID de la Compra: </strong>${e.id}</li>
                        <li style="font-size: 1.1rem; margin: .5rem;"><strong>N° de operación de Mercado Pago: </strong>${e.transaccion.transaccion_id}</li>
                    </ul>
                    <hr>
                    ${productosEnCarrito}
                    <p style="font-size: 1.1rem; margin: .5rem;"><strong>Total de la Compra: </strong>$${e.total.toFixed(2)}</p>
                    <p style="font-size: 1.1rem; margin: .5rem;"><strong>Fecha de la Compra: </strong>${e.fecha}</p>
                </div>

                <div style="background-color: rgba(200, 105, 32, 0.7); padding: .5rem 1rem; margin: 1rem 0; border-radius: 25px; z-index: 1; position: relative;">
                    <strong style="text-align: center; font-size: 1.3rem; z-index: 1; position: relative;">ATENCION</strong>
                    <ul style="list-style-type: none; text-align: center; padding: 0;">
                        <li style="font-size: 1.1rem; margin: .5rem;">Mercado Pago informa que el estado del pago es <strong>PENDIENTE</strong>. Te pedimos que revises el estado de tu pago en la aplicación de Mercado Pago desde tu celular o computadora. En este mail, te detallamos el N° de operación de Mercado Pago para que puedas encontrarlo.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">En caso que figure aprobado, te pedimos que nos envies el comprobante por WhatsApp.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">Si continua figurando pendiente, te pedimos que tengas paciencia, ya que el cambio de estado a aprobado o rechazado puede tardar aproximadamente 2hs.</li>
                        <li style="font-size: 1.1rem; margin: .5rem;">En caso que figure rechazado, te invitamos a que vuelvas a cargar tu orden de compra e intentes realizar el pago con otro medio.</li>
                    </ul>
                </div>
                
                <p style="font-style: italic; text-align: center; font-size: 1.2rem; z-index: 1; position: relative;">Si tenes alguna duda o consulta con respecto a tu pedido, no dudes en responder este mail y en breve te contactaremos.</p>
                
                <div style="position: relative; margin: 2rem auto; max-width: 300px; z-index: 1; background-color: white; border-radius: 25px; padding: 5px 0;">
                    <a style="text-decoration: none; color: black;" href="https://portafolio-jonatan-palavecino.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <p style="margin: 3px;">Desarrollado por Jonatan Palavecino</p>
                        <img style="width: 30px;" src="https://portafolio-jonatan-palavecino.vercel.app/images/logo%20portafolio.png" alt="logoportafolio">
                    </a>
                </div>
                
                <p style="font-weight: bold; z-index: 1; position: relative; margin: 2rem;">Mensaje automático del sistema de JB Premium.</p>
            </div>
        </div>
        `;
    
        const msg = {
            to: e.comprador.emailIngresado,
            from: {
                email: 'jnpr1992@gmail.com',
                name: 'Info - JB Premium',
            },
            subject: `Felicitaciones! Tu compra N° ${e.id} fue realizada con exito! - ACREDITACIÓN PENDIENTE`,
            html: contenidoCorreo,
        };
        
        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado al usuario correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico al usuario:', error);
        }

    }
};

module.exports = {
    enviarEmailCliente,
    enviarEmailUsuario
}