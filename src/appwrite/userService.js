import config from "../config/config";
import { Client, TablesDB } from "appwrite";

export class UserService {
    client = new Client();
    tablesDB;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.tablesDB = new TablesDB(this.client);
    }

    async createUser({ userId, name, email }) {
        return await this.tablesDB.createRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwriteUserTableId,
            rowId: userId,
            data: {
                userId,
                name,
                email,
            },
        });
    }
}

const userService = new UserService();

export default userService;