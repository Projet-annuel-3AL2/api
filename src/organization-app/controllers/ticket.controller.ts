import {getRepository, Repository} from "typeorm";
import {Ticket, TicketProps} from "../models/ticket.model";
import {User} from "../models/user.model";

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

    public async addComment(id: string): Promise<Ticket> {
        /*const ticket = await this.ticketRepository.findOneOrFail(id);
        return ticket;*/
        return null;
    }

    public async updateTicket(id: string, props: TicketProps): Promise<Ticket> {
        await this.ticketRepository.update(id, {...props});
        return await this.getById(id);
    }

    public async setAssignee(id: string, assignee: User): Promise<Ticket> {
        const ticket = await this.getById(id);
        ticket.assignee = assignee;
        return await this.ticketRepository.save(ticket);
    }
}
