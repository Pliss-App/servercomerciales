const servicios = require('../models/servicios');


exports.getAll = async (req, res) => {
    try {
        const response= await servicios.getAll(); // Esta función ya es `async`
        res.status(200).json({
            success: true,
            message: "Lista de servicios obtenida correctamente",
            result: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener servicios",
            error: error.message
        });
    }
};
