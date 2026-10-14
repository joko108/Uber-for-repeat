import request from 'supertest';
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

describe('Driver API Tests', () => {
    const app = express();
    setupApp(app);

    const testDriverData: DriverInputDto = {
        name: 'Alex',
        phoneNumber: '123-456-7890',
        email: 'alex@example.com',
        vehicleMake: 'Ford',
        vehicleModel: 'Focus',
        vehicleYear: 2011,
        vehicleLicensePlate: '3456-56',
        vehicleDescription: null,
        vehicleFeatures: [],
    };

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent_204);
    });

    it('should create new driver; POST /drivers', async () => {
        const getNewDriver: DriverInputDto = {
            ...testDriverData,
            name: 'Alex',
            phoneNumber: '123-456-7890',
            email: 'alex@example.com',
        };

        await request(app)
            .post('/drivers')
            .send(getNewDriver)
            .expect(HttpStatus.Created_201);
    });

    it('should return drivers list; GET /drivers', async () => {
        await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver1' })
            .expect(HttpStatus.Created_201);

        await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver2' })
            .expect(HttpStatus.Created_201);

        const getDriversListResponse = await request(app)
            .get('/drivers')
            .expect(HttpStatus.Ok_200);

        expect(getDriversListResponse.body).toBeInstanceOf(Array);
        expect(getDriversListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should return one driver by id; GET /drivers/:id', async () => {
        const createdDriver = await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatus.Created_201);

        const getDriverResponse = await request(app)
            .get(`/drivers/${createdDriver.body.id}`)
            .expect(HttpStatus.Ok_200);

        expect(getDriverResponse.body).toEqual({
            ...createdDriver.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });
});
