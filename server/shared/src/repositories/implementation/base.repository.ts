import { Model } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
	protected model: Model<T>;

	constructor(model: Model<T>) {
		this.model = model;
	}

	async create(data: Partial<T>): Promise<T> {
		return await this.model.create(data);
	}

	async findByUserId(userId: string): Promise<T | null> {
		return await this.model.findOne({ userId });
	}

	async updateUserById(userId: string, data: Partial<T>): Promise<T | null> {
		await this.model.updateOne({ userId }, data);
		return await this.model.findOne({ userId });
	}
}
