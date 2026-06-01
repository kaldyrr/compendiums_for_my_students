import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const defaultDb = {
  users: [],
  sessions: [],
  authRequests: [],
  invites: [],
  payments: [],
  auditLog: []
};

export class JsonStore {
  constructor(filePath) {
    this.filePath = resolve(filePath || "./data/dev-db.json");
    this.writeQueue = Promise.resolve();
  }

  async read() {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return { ...defaultDb, ...JSON.parse(raw) };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await this.write(defaultDb);
      return structuredClone(defaultDb);
    }
  }

  async write(data) {
    this.writeQueue = this.writeQueue.then(async () => {
      await mkdir(dirname(this.filePath), { recursive: true });
      await writeFile(this.filePath, `${JSON.stringify(data, null, 2)}\n`);
    });
    return this.writeQueue;
  }

  async update(mutator) {
    const data = await this.read();
    const result = await mutator(data);
    await this.write(data);
    return result;
  }
}
