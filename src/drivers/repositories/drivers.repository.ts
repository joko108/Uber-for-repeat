import { Driver } from "../types/driver";
import { db } from "../../db/in-memory.db";

export const driversRepository = {
    findAll(): Driver[] {
        return db.drivers;
    },

    findById(id: number): Driver | null {
        return db.drivers.find((d) => d.id === id) ?? null;
    },

    create(newDriver: Omit<Driver, 'id'>): Driver {
        const lastDriver = db.drivers[db.drivers.length - 1];
        const created: Driver = {
            id: lastDriver ? lastDriver.id + 1 : 1,
            ...newDriver,
        };

        db.drivers.push(created);
        return created;
    },

    update(id: number, driver: Omit<Driver, 'id' | 'createdAt'>): boolean {
        const index = db.drivers.findIndex((d) => d.id === id);

        if (index === -1) {
            return false;
        }

        db.drivers[index] = { ...db.drivers[index], ...driver };
        return true;
    },

    delete(id: number): boolean {
        const index = db.drivers.findIndex((d) => d.id === id);

        if (index === -1) {
            return false;
        }

        db.drivers.splice(index, 1);
        return true;
    }
};
