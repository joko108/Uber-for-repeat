import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { VehicleFeature } from "../../../src/drivers/types/driver";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { DRIVERS_PATH } from "../../../src/drivers/constants/drivers.paths";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";

describe('Driver API body validation chek', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

    const correctTestDriverData: DriverInputDto = {
        name: 'Alex',
        phoneNumber: '123-456-7890',
        email: 'alex@example.com',
        vehicleMake: 'Ford',
        vehicleModel: 'Focus',
        vehicleYear: 2011,
        vehicleLicensePlate: '3456-56',
        vehicleDescription: 'Some description',
        vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    beforeAll(async () => {
        await clearDb(app);
    });

    it(`❌should return 401 without auth; POST /api/drivers`, async () => {
        await request(app)
            .post(DRIVERS_PATH)
            .send(correctTestDriverData)
            .expect(HttpStatus.Unathorized_401);
    });

    it(`❌shouldn't create driver when incorrect body passed; POST /drivers`, async () => {
        const invalidDataSet1 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: '    ',
                phoneNumber: '    ',
                email: 'Invalid email',
                vehicleMake: '',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet1.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                phoneNumber: '',
                vehicleModel: '',
                vehicleYear: 'year',
                vehicleLicensePlate: '',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet2.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: 'A',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet3.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        // Проверяем, что ни один невалидный водитель не создался.
        const driverListResponse = await request(app)
            .get(DRIVERS_PATH)
            .set('Authorization', adminToken);

        expect(driverListResponse.body).toHaveLength(0);
    });

    it(`❌shouldn't update driver when incorrect body passed; PUT /drivers/:id`, async () => {
        const { body: { id: createdDriverId } } = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...correctTestDriverData })
            .expect(HttpStatus.Created_201);

        const invalidDataSet1 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: '    ',
                phoneNumber: '    ',
                email: 'Invalid email',
                vehicleMake: '',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet1.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                phoneNumber: '',
                vehicleModel: '',
                vehicleYear: 'year',
                vehicleLicensePlate: '',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet2.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: 'A',
            })
            .expect(HttpStatus.BadRequest_400);

        expect(invalidDataSet3.body.errorMessages).toBeInstanceOf(Array);
        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        const getResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken);

        expect(getResponse.body).toEqual({
            ...correctTestDriverData,
            id: createdDriverId,
            createdAt: expect.any(String),
        });
    });

    it(`❌shouldn't update driver when incorrect features passed; PUT /driver/:id`, async () => {
        const { body: { id: createdDriverId } } = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...correctTestDriverData })
            .expect(HttpStatus.Created_201);

        await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                vehicleFeatures: [
                    VehicleFeature.ChildSeat,
                    'invalid-features',
                    VehicleFeature.WiFi,
                ],
            })
            .expect(HttpStatus.BadRequest_400);

        const getResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken);

        expect(getResponse.body).toEqual({
            ...correctTestDriverData,
            id: createdDriverId,
            createdAt: expect.any(String),
        });
    });
});
