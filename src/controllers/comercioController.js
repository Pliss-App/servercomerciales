const Comercio = require('../models/comercio');
const pool = require('../config/db');

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
    const { titulo, descripcion, direccion, latitud, longitud, telefonos, servicios, foto_portada, imagenes, estado, horarios } = req.body;
    let connection;

    try {
        // Obtener conexión del pool
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Iniciar transacción

        // Insertar comercio
        const [comercio] = await connection.query(
            `INSERT INTO comercios (nombre, descripcion, direccion, latitud, longitud, foto_portada, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, direccion, latitud, longitud, foto_portada, estado]
        );

        const comercioId = comercio.insertId;

        // Insertar en comercio_area
        await connection.query(`INSERT INTO comercio_area (comercio_id, area_id) VALUES (?, ?)`, [comercioId, 1]);

        // Insertar teléfonos
        if (telefonos?.length) {
            for (let numero of telefonos) {
                await connection.query(`INSERT INTO telefonos (comercio_id, numero) VALUES (?, ?)`, [comercioId, numero]);
            }
        }

        // Insertar horarios
        if (horarios?.length) {
            for (let horario of horarios) {
                await connection.query(`INSERT INTO horarios (comercio_id, dia, apertura, cierre) VALUES (?, ?, ?, ?)`, [comercioId, horario.dia, horario.apertura, horario.cierre]);
            }
        }

        // Insertar servicios
        if (servicios?.length) {
            for (let servicioId of servicios) {
                await connection.query(`INSERT INTO comercio_servicios (comercio_id, servicio_id) VALUES (?, ?)`, [comercioId, servicioId]);
            }
        }

        // Insertar imágenes
        if (imagenes?.length) {
            for (let imagen of imagenes) {
                await connection.query(`INSERT INTO galeria_fotos (comercio_id, imagen_base64, url_imagen) VALUES (?, ?, ?)`, [comercioId, imagen, 'NULL']);
            }
        }

        await connection.commit(); // Confirmar transacción
        res.status(200).json({ success: true, message: "Comercio agregado exitosamente", comercioId });

    } catch (error) {
        if (connection) await connection.rollback(); // Deshacer cambios si hay error

        res.status(500).json({ success: false, message: "Error al agregar comercio", error: error.message });

    } finally {
        if (connection) connection.release(); // Liberar conexión
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
