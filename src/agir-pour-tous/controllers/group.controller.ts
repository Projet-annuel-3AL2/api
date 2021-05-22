import {getRepository, Repository} from "typeorm";
import {Post} from "../models/post.model";
import {Group, GroupProps} from "../models/group.model";

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
