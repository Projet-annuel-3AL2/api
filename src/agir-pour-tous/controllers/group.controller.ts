import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {Group, GroupProps} from "../models/group.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {GroupMembership} from "../models/group_membership.model";
import {Report, ReportProps} from "../models/report.model";

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
        const group = this.groupRepository.create({...props});
        const creatorMembership = getRepository(GroupMembership).create({group, user});
        group.members = [creatorMembership];
        const err = await validate(group);
        if (err.length > 0) {
            throw err;
        }
        return this.groupRepository.save(group);
    }

    public async getById(id: string): Promise<Group> {
        return await this.groupRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<Group[]> {
        return await this.groupRepository.find();
    }

    public async delete(groupName: string): Promise<void> {
        await this.groupRepository.softDelete(groupName);
    }

    public async update(groupName: string, props: GroupProps): Promise<Group> {
        await this.groupRepository.update(groupName, props);
        return this.getById(groupName);
    }

    public async getPosts(groupName: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.group", "Group")
            .where("Group.name=:groupName", {groupName})
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
            .where("ReportedGroup.id=:groupId", {groupId})
            .getMany();
    }
}
