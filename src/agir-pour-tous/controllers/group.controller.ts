import {getRepository, Repository} from "typeorm";
import {Post} from "../models/post.model";
import {Group, GroupProps} from "../models/group.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {GroupMembership} from "../models/group_membership.model";

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
        if(err.length > 0) {
            throw err;
        }
        return this.groupRepository.save(group);
    }

    public async getByGroupName(groupName: string): Promise<Group> {
        return await this.groupRepository.findOneOrFail(groupName);
    }

    public async getAll(): Promise<Group[]> {
        return await this.groupRepository.find();
    }

    public async delete(groupName: string): Promise<void> {
        await this.groupRepository.softDelete(groupName);
    }

    public async update(groupName: string, props: GroupProps): Promise<Group> {
        await this.groupRepository.update(groupName, props);
        return this.getByGroupName(groupName);
    }

    public async getPosts(groupName: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.group", "Group")
            .where("Group.name=:groupName", {groupName})
            .getMany();
    }
}
