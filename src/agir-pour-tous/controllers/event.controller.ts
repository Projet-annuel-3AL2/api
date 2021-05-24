import {getRepository, Repository} from "typeorm";
import {Event, EventProps} from "../models/event.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {UserController} from "./user.controller";

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


    public async create(user: User, props: EventProps) {
        let event = this.eventRepository.create({...props, user: user});
        const err = await validate(event, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        return this.eventRepository.save(event);

    }

    public async delete(id: string) {
        await this.eventRepository.delete(id);
    }

    public async update(eventId: string, props: EventProps): Promise<Event> {
        await this.eventRepository.update(eventId, props);
        return this.getById(eventId);
    }

    public async addParticipant(eventId: string, userId: string): Promise<void> {
        return await this.eventRepository.createQueryBuilder()
            .relation(User, "participants")
            .of(eventId)
            .add(userId);
    }

    public async removeParticipant(eventId: string, userId: string): Promise<void> {
        return await this.eventRepository.createQueryBuilder()
            .relation(User, "participants")
            .of(eventId)
            .remove(userId);
    }

    public async getEventWithLocation(userLocationX: number, userLocationY: number, range: number): Promise<Event[]> {
        let eventList = [];
        const events = await this.getAll();

        events.forEach(event => {
            if (EventController.getRangeEvent(event, userLocationX, userLocationY) < range){
                eventList.push(event);
            }
        });
        return eventList;
    };

    public async getWithName(userRecherche: string): Promise<Event[]> {
        return this.eventRepository
            .createQueryBuilder()
            .where("event.name like :userRecherche", {userRecherche: '%' + userRecherche + '%'})
            .getMany();
    }
    private static getRangeEvent(event: Event, userLocationX: number, userLocationY: number): number {
        return 1852 * 60 * Math.cbrt(
            Math.pow(
                    (event.longitude - userLocationX)
                    * Math.cos((userLocationY+event.latitude)/2), 2)
            + Math.pow(
                event.latitude - userLocationY,
            2)
        );
    };
}
