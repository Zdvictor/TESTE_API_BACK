import { FastifyInstance } from "fastify";
import { findEvent } from "../controllers/event/findEvent";
import { findAllEvents } from "../controllers/event/findAllEvents";
import { createEvent } from "../controllers/event/createEvent";
import { deleteEvent } from "../controllers/event/deleteEvent";
import { uploadEventImage } from "../controllers/event/uploadImage";




export default function EventRoutes(app: FastifyInstance) {


    app.get("/events", findAllEvents);
    app.get("/event/:id", findEvent);
    app.post("/event", createEvent);
    app.post("/event/upload-image", uploadEventImage);
    app.delete("/event/:id", deleteEvent);


}