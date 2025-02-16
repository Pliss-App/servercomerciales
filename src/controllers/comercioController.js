const Comercio = require('../models/comercio');


exports.getAllComerciosActive = async (req, res) => {
    try {
        const comercios = await Comercio.getAllActive(); // Esta función ya es `async`
        res.status(200).json({
            success: true,
            message: "Lista de comercios activos obtenida correctamente",
            result: comercios[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener comercios activos",
            error: error.message
        });
    }
};

exports.getAllComercios = async (req, res) => {
    try {
        const comercios = await Comercio.getAll();
        res.json(comercios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComercioById = async (req, res) => {
    try {
        const comercio = await Comercio.getById(req.params.id);
        if (!comercio) return res.status(404).json({ message: "Comercio no encontrado" });
        res.json(comercio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComercio = async (req, res) => {
    const { nombre, descripcion, direccion, latitud, longitud,   telefonos, servicios ,foto_portada, imagenes, estado, horarios} = req.body;

    try {
        const [comercio] = await db.query(
            `INSERT INTO comercios (nombre, descripcion, direccion, latitud, longitud, foto_portada, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion, direccion, latitud, longitud, foto_portada, estado]
        );

        const comercioId = comercio.insertId;

        // Insertar teléfonos
        if (telefonos && telefonos.length > 0) {
            for (let numero of telefonos) {
                await db.query(`INSERT INTO telefonos (comercio_id, numero) VALUES (?, ?)`, [comercioId, numero]);
            }
        }

                // Insertar Servicios
                if (horarios && horarios.length > 0) {
                    for (let horario of horarios) {
                        await db.query(`INSERT INTO horarios  (comercio_id, dia,apertura, cierre) VALUES (?, ?,?,?)`, [comercioId, horario.dia, horario.apertura, horario.cierre]);
                    }
                }

        // Insertar servicios
        if (servicios && servicios.length > 0) {
            for (let servicioId of servicios) {
                await db.query(`INSERT INTO comercio_servicios (comercio_id, servicio_id) VALUES (?, ?)`, [comercioId, servicioId]);
            }
        }

        // Insertar galeria
        if (imagenes && imagenes.length > 0) {
            for (let imagen of imagenes) {
                await db.query(`INSERT INTO galeria_fotos (comercio_id,  imagen_base64, url_imagen) VALUES (?, ?, ?)`, [comercioId, imagen, 'NULL']);
            }
        }

        res.status(200).json({ success: true, message: "Comercio agregado exitosamente", comercioId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al agregar comercio", error: error.message });
    }
};

exports.updateComercio = async (req, res) => {
    try {
        await Comercio.update(req.params.id, req.body);
        res.json({ message: "Comercio actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComercio = async (req, res) => {
    try {
        await Comercio.delete(req.params.id);
        res.json({ message: "Comercio eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
