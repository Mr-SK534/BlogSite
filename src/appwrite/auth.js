import config from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        const userAccount = await this.account.create(ID.unique(), email, password, name);
        if (userAccount) {
            return this.login({ email, password });
        }
        return userAccount;
    }

    async login({ email, password }) {
        return await this.account.createEmailPasswordSession(email, password);
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            // Returns null if no active session exists, instead of throwing
            return null;
        }
    }

    async logout() {
        await this.account.deleteSessions();
        return true;
    }
}

const authService = new AuthService();

export default authService;