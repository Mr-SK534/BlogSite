import config from "../config/config";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            },
        );
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        // Removed unused `userId` param — add it back if your schema supports updating it
        return await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
            },
        );
    }

    async deletePost(slug) {
        await this.databases.deleteDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
        );
        return true;
    }

    async getPost(slug) {
        return await this.databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
        );
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        // Fixed: now throws on error, consistent with all other methods
        return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            queries,
        );
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
    getFilePreview(fileId) {
        if (!fileId) return null;
        return this.bucket.getFilePreview(config.appwriteBucketID, fileId);
    }
}

const service = new Service();

export default service;