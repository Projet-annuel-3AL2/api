import {getRepository, Repository} from "typeorm";
import {Event} from "../models/event.model";

export class CategoryController {

    private static instance: CategoryController;

    private categoryRepository: Repository<CategoryController>;

    private constructor() {
        this.categoryRepository = getRepository(CategoryController);
    }

    public static getInstance(): CategoryController {
        if (CategoryController.instance === undefined) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    public async getById(categoryId: string): Promise<CategoryController> {
        return await this.categoryRepository.findOneOrFail(categoryId);
    }

    public async getAll(): Promise<CategoryController[]> {
        return await this.categoryRepository.find();
    }

    public async delete(categoryId: string): Promise<void> {
        await this.categoryRepository.softDelete(categoryId);
    }

    public async update(categoryId: string, props: CategoryController): Promise<CategoryController> {
        await this.categoryRepository.update(categoryId, props);
        return this.getById(categoryId);
    }

    public async getEvents(categoryId: string): Promise<Event[]> {
        return getRepository(Event).createQueryBuilder()
            .leftJoin("Event.category", "Category")
            .where("Category.id=:categoryId", {categoryId})
            .getMany();
    }
}
