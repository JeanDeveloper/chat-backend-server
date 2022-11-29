const { response } =  require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { findOne } = require('../models/user');

const crearUsuario = async ( req, res = response ) => {

    const { email, password } =  req.body;

    try {

        const existeEmail = await User.findOne({ email });

            if ( existeEmail ){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya existe'
            })
        }

        const user = new User( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        //Generar el JWT
        const token = await generarJWT( user.id )

        res.json({
            ok:true,
            user,
            token
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const login =  async (req, res = response) =>{

    const { email, password } =  req.body;

    try {

        const usuarioDB = await  User.findOne({ email })

        if ( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            })
        }

        //validar el password

        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es correcta'
            })
        }

        //generar el JWT
        const token =  await generarJWT( usuarioDB.id );

        res.json({
            ok:true,
            user: usuarioDB,
            token
        })
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const renewToken = async (req, res = response) => {

    const { uid } =  req.uid;

    const token =  await generarJWT( uid );

    const user  = await User.findById( uid )

    res.json({
        ok:true,
        user: user,
        token
    })

}



//CONST LOGIN ... REQ, RES ...
// { ok: true, msg: 'login'}
module.exports = {
    crearUsuario,
    login,
    renewToken
}