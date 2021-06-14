import {getRepository, Not, Repository} from "typeorm";
import {Report} from "../models/report.model";
import {User} from "../models/user.model";

export class ReportController {
    private static instance: ReportController;

    private reportRepository: Repository<Report>;

    private constructor() {
        this.reportRepository = getRepository(Report);
    }

    public static getInstance(): ReportController {
        if (ReportController.instance === undefined){
            ReportController.instance = new ReportController();
        }
        return ReportController.instance;
    }

    public async getAll(): Promise<Report[]> {
        return await this.reportRepository.find();
    }

    public async getById(reportId: string): Promise<Report> {
        return await this.reportRepository.findOneOrFail(reportId);
    }

    public async getAllFromUserReporter(userId: string) {
        return await this.reportRepository.find({
            where: {
                userReporter: userId
            }
        })
    }

    public async getAllReportedUser() {
        return await this.reportRepository.find({
            where: {
                userReported:  Not(null)
            }
        })
    }

    public async getAllReportFromReportedUser(userId: string){
        return await this.reportRepository.find({
            where: {
                userReporter: userId
            }
        })
    }

    public async getAllReportedOrga() {
        return await this.reportRepository.find({
            where: {
                userReported:  Not(null)
            }
        })
    }

    public async getAllReportFromReportedOrga(orgaId: string){
        return await this.reportRepository.find({
            where: {
                reportedOrganisation: orgaId
            }
        })
    }

    public async getAllReportedPost() {
        return await this.reportRepository.find({
            where: {
                reportedPost: Not(null)
            }
        })
    }

    public async getAllReportFromReportedPost(postId: string){
        return await this.reportRepository.find({
            where: {
                reportedPost: postId
            }
        })
    }

    public async getAllReportedEvent() {
        return await this.reportRepository.find({
            where: {
                reportedEvent: Not(null)
            }
        })
    }

    public async getAllReportFromReportedEvent(eventId: string){
        return await this.reportRepository.find({
            where: {
                reportedEvent: eventId
            }
        })
    }

    public async getAllReportedGroup() {
        return await this.reportRepository.find({
            where: {
                reportedGroup: Not(null)
            }
        })
    }

    public async getAllReportFromReportedGroup(groupId: string){
        return await this.reportRepository.find({
            where: {
                reportedGroup: groupId
            }
        })
    }

    public async delete(reportId: string): Promise<void> {
        await this.reportRepository.delete(reportId);
    }
}
