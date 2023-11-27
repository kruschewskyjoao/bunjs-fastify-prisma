import { PrismaClient } from "@prisma/client";
import ProfileRepo from "./profile/ProfileRepo";
import MessageRepo from "./message/MessageRepo";

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export default class Repository {
  private readonly client: PrismaClient;
  readonly profileRepo: ProfileRepo;
  readonly messageRepo: MessageRepo;

  constructor() {
    this.client = new PrismaClient();
    this.profileRepo = new ProfileRepo(this.client);
    this.messageRepo = new MessageRepo(this.client);
  }

  async close() {
    await this.client.$disconnect();
  }
}
