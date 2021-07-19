import {getRepository, MoreThan, Repository} from "typeorm";
import {Event, EventProps} from "../models/event.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Post} from "../models/post.model";
import {Report, ReportProps} from "../models/report.model";
import {OrganisationMembership} from "../models/organisation_membership.model";
import {Category} from "../models/category.model";
import {Organisation} from "../models/organisation.model";

export class EventController {

    private static instance: EventController;
    private eventRepository: Repository<Event>;
    private userRepository: Repository<User>;


    private constructor() {
        this.eventRepository = getRepository(Event);
        this.userRepository = getRepository(User);
    }

    public static getInstance(): EventController {
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
            relations: ['organisation', 'category', 'user', 'picture']
        })
    }

    public async create(user: User, props: EventProps) {
        let event = await this.eventRepository.create({...props, user: user, startDate:new Date(props.startDate), endDate: new Date(props.endDate)});
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

    async getEventsSearch(userLocationX: string, userLocationY: string, range: string, startDate: any, endDate: string, categoryId: string): Promise<Event[]> {
        const searchQuery: any = this.eventRepository.createQueryBuilder();

        if (userLocationX !== "undefined" && userLocationY !== "undefined" && range !== "undefined") {
            const longitude =  Number(userLocationY);
            const latitude = Number(userLocationX);
            const rangeNumber = Number(range);
            searchQuery.andWhere("(1852 * 60 * cbrt((Event.longitude - :longitude) * cos(:latitude + Event.latitude) / 2)^2 + ((Event.latitude - :latitude)^ 2)) < :rangeNumber"
                , {
                rangeNumber,
                longitude,
                latitude
            });
        }
        if (startDate !== "undefined" && endDate !== "undefined") {
            const start = new Date(startDate);
            const end = new Date(endDate)
            searchQuery.andWhere("Event.startDate > :start", {start})
                .andWhere("Event.endDate < :end", {end})
        }
        if (categoryId !== "undefined") {
            searchQuery.leftJoinAndSelect("Event.category", "Category")
                .andWhere("Category.id=:categoryId", {categoryId})

        }
        return await searchQuery.getMany();
    }

    public async searchByName(name: string): Promise<Event[]> {
        return this.eventRepository
            .createQueryBuilder()
            .where("event.name like :name", {name: '%' + name + '%'})
            .getMany();
    }

    public async getEventMembers(eventId: string): Promise<User[]> {
        return await this.userRepository.createQueryBuilder()
            .leftJoin("User.eventsParticipation", "Event")
            .where("Event.id=:eventId", {eventId})
            .getMany();
    }

    public async getPosts(eventId: string): Promise<Post[]> {
        return await getRepository(Post).createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoinAndSelect("User.certification", "Cert")
            .leftJoinAndSelect("Post.sharedEvent", "Event")
            .where("Event.id=:eventId", {eventId})
            .getMany();
    }

    public async reportEvent(userReporter: User, reportedEvent: Event, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedEvent});
        return await getRepository(Report).save(report);
    }

    public async getReports(postId: string): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoin("Report.reportedEvent", "ReportedEvent")
            .where("ReportedEvent.postId=:postId", {postId})
            .getMany();
    }

    public async isOwner(userId:string, eventId:string):Promise<boolean>{
        return (await this.getOwners(eventId)).some(user => user.id === userId);
    }

    public async getOwners(eventId: string): Promise<User[]> {
        return (await this.getOrganisationOwners(eventId))
            .concat(await this.getOwner(eventId));
    }

    public async getOrganisationOwners(eventId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.organisations", "OrganisationMembership")
            .leftJoin("OrganisationMembership.organisation", "Organisation")
            .leftJoin("Organisation.events", "Event")
            .where("Event.id=:eventId", {eventId})
            .andWhere("OrganisationMembership.isAdmin = true OR OrganisationMembership.isOwner = true")
            .getMany();
    }

    public async getOwner(eventId: string): Promise<User> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.createdEvents", "Event")
            .where("Event.id=:eventId", {eventId})
            .getOne();
    }

    public async isMember(userId: string,eventId: string): Promise<boolean> {
        return (await getRepository(Event).createQueryBuilder()
            .leftJoin("Event.participants", "User")
            .where("Event.id=:eventId", {eventId})
            .andWhere("User.id=:userId", {userId})
            .getOne() !== undefined);
    }

    public async getSuggestion(): Promise<Event[]> {
        const dateNow = new Date(Date.now());
        return await this.eventRepository.find({
            where: {
                endDate: MoreThan(dateNow)
            },
            take: 3
        })
    }

    public async getProfil(eventId: string): Promise<Event> {
        return await this.eventRepository.findOneOrFail({
            where: {
                id: eventId
            },
            relations: ['user', 'organisation', 'category', 'picture']
        })
    }

    public async getCategory(eventId: string): Promise<Category>{
        return await getRepository(Category).createQueryBuilder()
            .leftJoin("Category.events","Event")
            .where("Event.id=:eventId",{eventId})
            .getOne();
    }

    public async getOrganisation(eventId: string): Promise<Category>{
        return await getRepository(Organisation).createQueryBuilder()
            .leftJoin("Organisation.events","Event")
            .where("Event.id=:eventId",{eventId})
            .getOne();
    }
}
