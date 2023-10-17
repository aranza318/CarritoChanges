import { getTickets, createNewTicket } from "../services/tickets.service.js";

export async function getAllTickets (req, res){
    try {
        const ticket = await getTickets();
        if(ticket){
            res.json(ticket)
        } else{
            res.json({message:"No existen tickets"})
        }
    } catch (error) {
        res.json(error)
    }
}

export async function createTicket (req, res){
    try {
        console.log("Datos recibidos: ", req.body);
        const obj = req.body
        const ticket = await createNewTicket(obj)
        if(ticket){
            console.log("Ticket creado con exito", ticket);
            res.status(201).json(ticket)
        } else {
            throw new Error("No se pudo generar el ticket")
        }
    } catch (error) {
        console.error("Error al crear el ticket: ", error);
        res.status(500).json({error: error.message})
    }
}