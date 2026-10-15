import request from 'supertest';
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { VehicleFeature } from "../../../src/drivers/types/driver";
import { DRIVERS_PATH } from "../../../src/drivers/constants/drivers.paths";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";

describe('Driver API Tests', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

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
        await clearDb(app);
    });

    it('✅should create new driver; POST /api/drivers', async () => {
        const getNewDriver: DriverInputDto = {
            ...testDriverData,
            name: 'Alex',
            phoneNumber: '123-456-7890',
            email: 'alex@example.com',
        };

        await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send(getNewDriver)
            .expect(HttpStatus.Created_201);
    });

    it('✅should return drivers list; GET /api/drivers', async () => {
        await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...testDriverData, name: 'Another Driver1' })
            .expect(HttpStatus.Created_201);

        await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...testDriverData, name: 'Another Driver2' })
            .expect(HttpStatus.Created_201);

        const getDriversListResponse = await request(app)
            .get(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok_200);

        expect(getDriversListResponse.body).toBeInstanceOf(Array);
        expect(getDriversListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it('✅should return one driver by id; GET /api/drivers/:id', async () => {
        const createdDriver = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatus.Created_201);

        const getDriverResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriver.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok_200);

        expect(getDriverResponse.body).toEqual({
            ...createdDriver.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });

    it('✅should update driver by id; PUT /api/drivers/:id', async () => {
        const createdDriver = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatus.Created_201);

        const driverUpdateData: DriverInputDto = {
            name: 'Update Name',
            phoneNumber: '999-888-7777',
            email: 'updated@example.com',
            vehicleMake: 'Tesla',
            vehicleModel: 'Model S',
            vehicleYear: 2022,
            vehicleLicensePlate: 'NEW-789',
            vehicleDescription: 'Updated vehicle description',
            vehicleFeatures: [VehicleFeature.ChildSeat],
        };

        await request(app)
            .put(`${DRIVERS_PATH}/${createdDriver.body.id}`)
            .set('Authorization', adminToken)
            .send(driverUpdateData)
            .expect(HttpStatus.NoContent_204);

        const driverResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriver.body.id}`)
            .set('Authorization', adminToken)

        expect(driverResponse.body).toEqual({
            ...driverUpdateData,
            id: createdDriver.body.id,
            createdAt: expect.any(String),
        });
    });

    it('✅should delete driver dy id; DELETE /api/drivers/:id', async () => {
        const createdDriver = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...testDriverData, name: 'Another Driver' })
            .expect(HttpStatus.Created_201);

        await request(app)
            .delete(`${DRIVERS_PATH}/${createdDriver.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent_204);

        await request(app)
            .get(`${DRIVERS_PATH}/${createdDriver.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound_404);
    });
});
