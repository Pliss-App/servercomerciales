const pool = require('../config/db');

const Comercio = {

    async getAllActive() {
        try {
            const [rows] = await pool.execute("SELECT count(1) as total FROM comercios WHERE estado = 'activo'");
            return rows;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getAll() {
        const [rows] = await pool.query("SELECT * FROM comercios");
        return rows;
    },

    async getByIdFilterService(id) {
        try {
            const [rows] = await pool.query(`SELECT DISTINCT c.*
FROM comercios c
LEFT JOIN comercio_servicios cs ON c.id = cs.comercio_id
WHERE c.estado = 'activo'
AND ( COALESCE(${id}, NULL) IS NULL OR cs.servicio_id = ${id} );
`);
            return rows;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getById(id) {
        const [rows] = await pool.query("SELECT * FROM comercios WHERE id = ?", [id]);
        return rows[0];
    },

    async create(data) {
        const { nombre, descripcion, telefono, latitud, longitud, direccion, portada, estado } = data;
        const [result] = await pool.query("INSERT INTO comercios (nombre, descripcion, telefono, latitud, longitud, direccion, portada, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, descripcion, telefono, latitud, longitud, direccion, portada, estado]);
        return result.insertId;
    },

    async update(id, data) {
        const { nombre, descripcion, telefono, latitud, longitud, direccion, portada, estado } = data;
        await pool.query("UPDATE comercios SET nombre=?, descripcion=?, telefono=?, latitud=?, longitud=?, direccion=?, portada=?, estado=? WHERE id=?",
            [nombre, descripcion, telefono, latitud, longitud, direccion, portada, estado, id]);
    },

    async delete(id) {
        await pool.query("DELETE FROM comercios WHERE id=?", [id]);
    }
};

module.exports = Comercio;
