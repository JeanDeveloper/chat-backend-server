    /*
        path: api/login
    */

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// localhost:3000/api/login/new
router.post( '/new',[

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),

    validarCampos

], crearUsuario )

//  localhost:3000/api/login/  
router.post( '/', [
    check('email', 'El email no es valido').not().isEmpty().isEmail(),
    check( 'password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login )


//  localhost:3000/api/login/  
router.get( '/renew', validarJWT, renewToken )



module.exports = router;