import {getRepository, Repository} from "typeorm";
import {Event} from "../models/event.model";
import {Category, CategoryProps} from "../models/category.model";
import {validate} from "class-validator";

export class CategoryController {

    private static instance: CategoryController;

    private categoryRepository: Repository<Category>;

    private constructor() {
        this.categoryRepository = getRepository(Category);
    }

    public static getInstance(): CategoryController {
        if (CategoryController.instance === undefined) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    public async getById(categoryId: string): Promise<Category> {
        return await this.categoryRepository.findOneOrFail(categoryId);
    }

    public async getAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    public async delete(categoryId: string): Promise<void> {
        await this.categoryRepository.softDelete(categoryId);
    }

    public async update(categoryId: string, props: CategoryProps): Promise<Category> {
        await this.categoryRepository.update(categoryId, props);
        return this.getById(categoryId);
    }

    public async getEvents(categoryId: string): Promise<Event[]> {
        return getRepository(Event).createQueryBuilder()
            .leftJoin("Event.category", "Category")
            .where("Category.id=:categoryId", {categoryId})
            .getMany();
    }

    public async create(props: CategoryProps): Promise<Category> {
        const category = this.categoryRepository.create({...props});
        const err = await validate(category);
        if (err.length > 0) {
            throw err;
        }
        return this.categoryRepository.save(category);
    }
}
