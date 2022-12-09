
const { response } = require('express')
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async( req, resp= response )=> {
    
    try {
        const { email, password } = req.body;

        let usuario = await Usuario.findOne({ email });


        if ( usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: `Un usuario existe con ese correo ${email}`
            })

        }

        usuario = new Usuario(req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario. save();

        const token = await generarJWT( usuario._id, usuario.name );

      
        resp.status(201).json({
                ok: true,
                uid: usuario._id,
                name: usuario.name,
                token
        })
        
    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
    })
    }

}


const loginUsuario = async( req, resp= response )=> {

    const { email, password } = req.body;


    try {


        let usuario = await Usuario.findOne({ email });


        if ( !usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: `Un usuario no existe con ese correo ${email}`
            })
        }

        //confirmar los paswword
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if ( !validPassword ) {
            resp.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
        })
        }
        //Generar json web token
        
        const token = await generarJWT( usuario._id, usuario.name );

        resp.json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
    })
    }

}

const revalidarToken = async( req, resp= response )=> {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );


    resp.json({
        ok: true,
        token
        
    })
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}