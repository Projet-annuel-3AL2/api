import {getRepository, MoreThan, Repository} from "typeorm";
import {Event, EventProps} from "../models/event.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Post} from "../models/post.model";

export class EventController {
    private static instance: EventController;
    private eventRepository: Repository<Event>;
    private userRepository: Repository<User>;


    private constructor() {
        this.eventRepository = getRepository(Event);
        this.userRepository = getRepository(User);
    }

    public static async getInstance(): Promise<EventController> {
        if (EventController.instance === undefined) {
            EventController.instance = new EventController();
        }
        return EventController.instance;
    }

    public async getAll(): Promise<Event[]> {
        return await this.eventRepository.find();
    }

    public async getById(id: string): Promise<Event> {
        return await this.eventRepository.findOneOrFail(id);
    }

    public getAllNotEnd(): Promise<Event[]> {
        const dateNow = new Date(Date.now());
        return this.eventRepository.find({
            where: {
                endDate: MoreThan(dateNow)
            },
            relations: ['organisation', 'category']
        })
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
        return await this.getById(eventId);
    }

    public async addParticipant(eventId: string, userId: string): Promise<void> {
        return await this.eventRepository.createQueryBuilder()
            .relation(Event, "participants")
            .of(eventId)
            .add(userId);
    }

    public async removeParticipant(eventId: string, userId: string): Promise<void> {
        return await this.eventRepository.createQueryBuilder()
            .relation(Event, "participants")
            .of(eventId)
            .remove(userId);
    }

    public async getEventWithLocation(userLocationX: number, userLocationY: number, range: number): Promise<Event[]> {
        return this.eventRepository.createQueryBuilder()
            .where("1852 * 60 * cbrt(pow((longitude - :userLocationX) * cos(:userLocationY + latitude) / 2) ,2) + pow(latitude - :userLocationY, 2) > :range", {
                range,
                userLocationX,
                userLocationY
            })
            .getMany();
    };

    public async getEventWithLocationNotEnd(userLocationX: number, userLocationY: number, range: number): Promise<Event[]> {
        const dateNow = Date.now();
        return this.eventRepository.createQueryBuilder()
            .where("1852 * 60 * cbrt(pow((longitude - :userLocationX) * cos(:userLocationY + latitude) / 2) ,2) + pow(latitude - :userLocationY, 2) > :range AND dateEnd >=:dateNow", {
                range,
                userLocationX,
                userLocationY,
                dateNow
            })
            .getMany();
    };

    public async getWithNameRecherche(userRecherche: string): Promise<Event[]> {
        return this.eventRepository
            .createQueryBuilder()
            .where("event.name like :userRecherche", {userRecherche: '%' + userRecherche + '%'})
            .getMany();
    }

    public async getWithName(eventName: string): Promise<Event> {
        return this.eventRepository
            .createQueryBuilder()
            .where("event.name = :eventName", {eventName})
            .getOne();
    }

    public async isNameNotUse(name): Promise<boolean> {
        const event = await this.getWithName(name);
        return event == null;
    }

    public async getEventMembers(eventId: string): Promise<User[]> {
        return await this.userRepository.createQueryBuilder()
            .leftJoin("User.eventParticipation", "Event")
            .where("Event.id=:eventId", {eventId})
            .getMany();
    }

    public async getPosts(eventId: string): Promise<Post[]>{
        return await getRepository(Post).createQueryBuilder()
            .leftJoin("Post.sharedEvent","Event")
            .where("Event.id=:eventId",{eventId})
            .getMany();
    }
}
