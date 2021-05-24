import {getRepository, Repository} from "typeorm";
import {Event, EventProps} from "../models/event.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";

export class EventController{
    private static instance: EventController;
    private eventRepository: Repository<Event>;


    private constructor() {
        this.eventRepository = getRepository(Event);
    }

    public static async getInstance(): Promise<EventController> {
        if (EventController.instance === undefined) {
            EventController.instance = new EventController();
        }
        return EventController.instance;
    }

    public getAll(): Promise<Event[]> {
        return this.eventRepository.find();
    }

    public getById(id: string): Promise<Event> {
        return this.eventRepository.findOneOrFail(id);
    }

    // TODO : Rajouter OwnerShip
    public async create(props: EventProps) {
        let event = this.eventRepository.create({...props});
        const err = await validate(event, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        return await this.eventRepository.save(event);

    }

    public async delete(id: string) {
        await this.eventRepository.delete(id);
    }
}
