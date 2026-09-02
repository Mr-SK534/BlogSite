import config from "../config/config";
import { Client, Account, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        return await this.tablesDB.createRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteCollectionId,
            rowId: slug,
            data: {
                title,
                content,
                featuredImage,
                status,
                userId,
            },
        });
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        // Removed unused `userId` param — add it back if your schema supports updating it
        return await this.tablesDB.updateRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteCollectionId,
            rowId: slug,
            data: {
                title,
                content,
                featuredImage,
                status,
            },
        });
    }

    async deletePost(slug) {
        await this.tablesDB.deleteRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteCollectionId,
            rowId: slug,
        });
        return true;
    }

    async getPost(slug) {
        return await this.tablesDB.getRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteCollectionId,
            rowId: slug,
        });
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        return await this.tablesDB.listRows({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteCollectionId,
            queries,
        });
    }

    async uploadFile(file) {
        return await this.bucket.createFile(
            config.appwriteBucketID,
            ID.unique(),
            file,
        );
    }

    async deleteFile(fileId) {
        await this.bucket.deleteFile(config.appwriteBucketID, fileId);
        return true;
    }

    // Synchronous — do not await this method
    getFileView(fileId) {
        if (!fileId) return null;
        return this.bucket.getFileView(config.appwriteBucketID, fileId);
    }
}

const service = new Service();

export default service;