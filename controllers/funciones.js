const { collection, getDocs, writeBatch, query, where, documentId, setDoc, doc } = require("@firebase/firestore");
const db = require("../config/database.config.js");

const nuevoId = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nuevoId = ''
    for (let i = 0; i < 20; i++) {
        const indice = Math.floor(Math.random() * caracteres.length)
        nuevoId += caracteres.charAt(indice)
    }
    return nuevoId
}

const generadorIdNuevo = async () => {

    const ordenesDeCompraRef = collection(db, "ordenesDeCompra")

    try {
        const snapshot = await getDocs(ordenesDeCompraRef);
        const ids = snapshot.docs.map((doc) => doc.id);
        let newId = nuevoId()
        const isTrue = ids.includes(newId)
        while (isTrue) {
            let newId = nuevoId()
            const isTrue = ids.includes(newId)
            if (!isTrue) {
                return newId
            } else {
                return
            }
        }
        return newId
    } catch (error) {
        console.error('Error al obtener IDs:', error);
        throw error;
    }
};

const  cargarOrdenEnDataBase = async (orden) => {

    const ordenesDeCompraRef = collection(db, "ordenesDeCompra")
    const productosRef = collection(db, "productos")
    const batch = writeBatch(db)
    const cart = Object.values(orden.carrito)

    const q = query(productosRef, where( documentId(), "in", cart.map( (el) => el.id) ) )
    const productos = await getDocs(q)
    const fueraDeStock = []

    productos.docs.forEach((doc) => {
        const item = cart.find((el) => el.id === doc.id)

        if (doc.data().stock >= item.cantidad) {
            batch.update(doc.ref, {stock: doc.data().stock - item.cantidad})
        } else {
            fueraDeStock.push(item)
        }
    })

    //Si no hay items que fueron a parar a "fueraDeStock", se agrega el documento orden a la coleccion de ordenesDeCompraRef

    if (fueraDeStock.length === 0) {

        try {
            // Agregar el documento orden a la colección de ordenesDeCompraRef
            await setDoc(doc(ordenesDeCompraRef, orden.id), orden)
            
            // Realizar la commit del lote
            await batch.commit()

            console.log("Stock actualizado y OC cargada con éxito!");
        } catch (err) {
            console.log("Error al actualizar stock u OC: ", err);
        }

    } else {
        console.log("No hay stock de los vinos seleccionados.");
    }

}

module.exports = {
    generadorIdNuevo,
    db,
    cargarOrdenEnDataBase,
}