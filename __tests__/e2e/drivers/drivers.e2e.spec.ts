import request from 'supertest';
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatuses } from "../../../src/core/http-statuses";

describe('Driver API Test', () => {
    const app = express();
    setupApp(app);

    const testDriverData: DriverInputDto = {
        name: 'Alex',
        phoneNumber: '123-456-7980',
        email: 'alex@example.com',
        vehicleMake: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: 2021,
        vehicleLicensePlate: 'ABC-123',
        vehicleDescription: null,
        vehicleFeatures: [],
    };

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatuses.NoContent_204);
    });

    it('should create new driver; POST /drivers', async () => {
        const newDriver: DriverInputDto = {
            ...testDriverData,
            name: 'Alex',
            phoneNumber: '123-456-7980',
            email: 'alex@example.com',
        };

        await request(app)
            .post('/drivers')
            .send(newDriver)
            .expect(HttpStatuses.Created_201);
    });

    it('should return drivers list; GET /drivers', async () => {
        await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver1' })
            .expect(HttpStatuses.Created_201);

        await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver1' })
            .expect(HttpStatuses.Created_201);

        const getDriversList = await request(app)
            .get('/drivers')
            .expect(HttpStatuses.Ok_200);

        expect(getDriversList.body).toBeInstanceOf(Array);
        expect(getDriversList.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should return one driver by id; GET /drivers', async () => {
        const createdDriver = await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatuses.Created_201);

        const responseDriver = await request(app)
            .get(`/drivers/${createdDriver.body.id}`)
            .expect(HttpStatuses.Ok_200);

        expect(responseDriver.body).toEqual({
            ...createdDriver.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });
});