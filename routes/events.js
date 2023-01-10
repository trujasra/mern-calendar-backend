/*
    Rutas de Eventos / Eventos
    host + /api/events
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isDate } = require("../helpers/isDate");

const router = Router();

// validacion  del JWT de todas las rutas
router.use(validarJWT);


// Obtener eventos
router.get("/", getEventos);

// Crear un nuevo evento
router.post("/", [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatorio").custom(isDate),
    check("end", "Fecha de finalizacion es obligatorio").custom(isDate),
    validarCampos
], crearEvento);

// Actualziar evento
router.put("/:id",
    [
        check("title", "El titulo es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatorio").custom(isDate),
        check("end", "Fecha de finalizacion es obligatorio").custom(isDate),
        validarCampos
    ], actualizarEvento);

// eliminar evento
router.delete("/:id", eliminarEvento);

module.exports = router;


