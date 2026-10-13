import request from 'supertest';
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatuses } from "../../../src/core/http-statuses";

describe('Driver API Test', () => {
    const app = express();
    setupApp(app);

    const testDriverData: DriverInputDto = {
        name: 'Sergeich',
        phoneNumber: '123-456-789',
        email: 'sergeich@example.com',
        vehicleMake: 'Ford',
        vehicleModel: 'Focus',
        vehicleYear: 2011,
        vehicleLicensePlate: 'v001or23rus',
        vehicleDescription: 'my life - my rules',
        vehicleFeatures: [],
    };

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatuses.NoContent_204);
    });

    it('should create driver; POST /drivers', async () => {
        const newDriver: DriverInputDto = {
            ...testDriverData,
            name: 'Sergeich',
            phoneNumber: '123-456-789',
            email: 'sergeich@example.com',
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
            .send({ ...testDriverData, name: 'Another Driver2' })
            .expect(HttpStatuses.Created_201);

        const driverListResponse = await request(app)
            .get('/drivers')
            .expect(HttpStatuses.Ok_200);

        expect(driverListResponse.body).toBeInstanceOf(Array);
        expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should be return driver by id; GET /drivers/:id', async () => {
        const createResponse = await request(app)
            .post('/drivers')
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatuses.Created_201);

        const getResponse = await request(app)
            .get(`/drivers/${createResponse.body.id}`)
            .expect(HttpStatuses.Ok_200);

        expect(getResponse.body).toEqual({
            ...createResponse.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });
});