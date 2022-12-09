const { response } = require("express")
const Evento = require("../models/Evento")



const getEventos = async( req, resp= response )=> {
    try {
        
        const eventos = await Evento.find()
        .populate('user','name');

        resp.json({
            ok: true,
            eventos
        })


    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const crearEvento = async( req, resp= response )=> {
    try {
        
        const evento = new Evento( req.body );

        evento.user = req.uid;

        const eventSave = await evento.save()


        resp.json({
            ok: true,
            evento: eventSave         
        })


    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const actualizarEvento = async( req, resp= response )=> {
    try {

        const eventId = req.params.id;

        const evento = await Evento.findById(eventId);

        if ( !evento )  return resp.status(400).json({
            ok: false,
            msg: 'Evento no existe por ese id'            
        })

        if ( evento.user.toString() !== req.uid )   return resp.status(401).json({
            ok: false,
            msg: 'No tiene privilegio para editar '            
        })

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoAct = await Evento.findByIdAndUpdate(eventId, nuevoEvento,{new :true});

        
        resp.json({
            ok: true,
            evento: eventoAct            
        })


    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const eliminarEvento = async( req, resp= response )=> {
    try {
        
        const eventId = req.params.id;

        const evento = await Evento.findById(eventId);

        if ( !evento )  return resp.status(400).json({
            ok: false,
            msg: 'Evento no existe por ese id'            
        })

        if ( evento.user.toString() !== req.uid )   return resp.status(401).json({
            ok: false,
            msg: 'No tiene privilegio para eliminar '            
        })

        await Evento.findByIdAndDelete( eventId ) 


        resp.json({
            ok: true,   
        })


    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}




module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}