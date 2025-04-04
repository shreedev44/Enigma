export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>
    findByUserId(userId: string): Promise<T | null>
    updateUserById(userId: string, data: Partial<T>): Promise<T | null>
}