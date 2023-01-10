const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Un usuario existe con ese correo",
            });
        }

        usuario = new Usuario(req.body);

        // Encripytar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario._id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el administrador",
        });
    }
};

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe con ese email",
            });
        }

        // confirmar los password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Password incorrecto",
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario._id, usuario.name);

        res.json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "por favor hable con el administrador",
        });

    }
};

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    // generar un nuevo JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
    });
};




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}