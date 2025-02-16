const pool = require('../config/db');

const Comercio = {


    async getAll() {
        const [rows] = await pool.query("SELECT * FROM servicios");
        return rows;
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
