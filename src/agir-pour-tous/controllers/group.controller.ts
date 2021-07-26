import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {Group, GroupProps} from "../models/group.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {GroupMembership} from "../models/group_membership.model";
import {Report, ReportProps} from "../models/report.model";
import {Conversation} from "../models/conversation.model";

export class GroupController {
    private static instance: GroupController;

    private groupRepository: Repository<Group>;

    private constructor() {
        this.groupRepository = getRepository(Group);
    }

    public static getInstance(): GroupController {
        if (GroupController.instance === undefined) {
            GroupController.instance = new GroupController();
        }
        return GroupController.instance;
    }

    public async create(user: User, props: GroupProps): Promise<Group> {
        const group = this.groupRepository.create({...props, conversation: new Conversation()});
        const creatorMembership = getRepository(GroupMembership).create({user});
        group.members = props.users.map(user=>getRepository(GroupMembership).create({user}));
        group.members.push(creatorMembership);
        const err = await validate(group);
        if (err.length > 0) {
            throw err;
        }
        return await this.groupRepository.save(group);
    }

    public async getById(id: string): Promise<Group> {
        return await this.groupRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<Group[]> {
        return await this.groupRepository.find();
    }

    public async delete(groupId: string): Promise<void> {
        await this.groupRepository.delete(groupId);
    }

    public async update(groupId: string, props: GroupProps): Promise<Group> {
        await this.groupRepository.update(groupId, props);
        return this.getById(groupId);
    }

    public async getPosts(groupId: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.group", "Group")
            .where("Group.id=:groupId", {groupId})
            .getMany();
    }

    public async addPost(group: Group, creator: User, props: PostProps): Promise<Post> {
        const post = getRepository(Post).create({...props, creator, group});
        const err = await validate(post);
        if (err.length > 0) {
            throw err;
        }
        return getRepository(Post).save(post);
    }

    public async reportGroup(userReporter: User, reportedGroup: Group, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedGroup});
        return await getRepository(Report).save(report);
    }

    public async getReports(groupId: string): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoin("Report.reportedGroup", "ReportedGroup")
            .leftJoinAndSelect("Report.userReporter", "UserReporter")

            .where("ReportedGroup.id=:groupId", {groupId})
            .getMany();
    }

    async getAllReport(): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.reportedGroup", "ReportedGroup")
            .where("Report.reportedGroup is not null")
            .getMany();
    }

    async countReport(groupId: string) {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.reportedGroup", "ReportedGroup")
            .where("ReportedGroup.id =:groupId", {groupId})
            .getCount();
    }

    async removeUser(groupId:string,userId:string) {
        await getRepository(GroupMembership).remove(await getRepository(GroupMembership).createQueryBuilder()
            .leftJoinAndSelect("GroupMembership.user","User")
            .leftJoinAndSelect("GroupMembership.group","Group")
            .where("User.id=:userId",{userId})
            .andWhere("Group.id=:groupId",{groupId})
            .getOne());
        const membersCount = await getRepository(GroupMembership).createQueryBuilder()
            .leftJoin("GroupMembership.group","Group")
            .where("Group.id=:groupId",{groupId})
            .getCount()
        if (membersCount <= 1){
            await this.groupRepository.delete(groupId);
        }
    }
}
