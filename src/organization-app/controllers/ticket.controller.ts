import {getRepository, Repository} from "typeorm";
import {Ticket, TicketProps} from "../models/ticket.model";
import {Comment, CommentProps} from "../models/comment.model";

export class TicketController {

    private static instance: TicketController;

    private ticketRepository: Repository<Ticket>;

    private constructor() {
        this.ticketRepository = getRepository(Ticket);
    }

    public static async getInstance(): Promise<TicketController> {
        if (TicketController.instance === undefined) {
            TicketController.instance = new TicketController();
        }
        return TicketController.instance;
    }

    public async getById(id: string): Promise<Ticket> {
        return await this.ticketRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<Ticket[]> {
        return await this.ticketRepository.find();
    }

    public async deleteTicket(id: string) {
        await this.ticketRepository.delete(id);
    }

    public async addComment(ticketId: string, userId: string, props: CommentProps): Promise<Comment> {
        const comment = getRepository(Comment).create({...props, ticketId, userId});
        return getRepository(Comment).save(comment);
    }

    public async updateTicket(id: string, props: TicketProps): Promise<Ticket> {
        await this.ticketRepository.update(id, {...props});
        return await this.getById(id);
    }

    public async setAssignee(id: string, userId: string): Promise<void> {
        await this.ticketRepository.createQueryBuilder()
            .relation(Ticket, "assignee")
            .of(id)
            .set(userId);
    }

    public async getComments(ticketId: string): Promise<Comment[]> {
        return await getRepository(Comment).createQueryBuilder()
            .leftJoin("Comment.ticket", "Ticket")
            .where("Ticket.id = :ticketId", {ticketId})
            .getMany();
    }
}
