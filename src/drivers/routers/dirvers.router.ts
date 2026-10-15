import { Router } from "express";
import { DRIVERS_ROUTES } from "../constants/drivers.paths";
import { getDriverListHandler } from "../handlers/get-driver-list.handler";
import { getDriverHandler } from "../handlers/get-driver.handler";
import {createDriverHandler} from "../handlers/create-driver.handler";
import {updateDriverHandler} from "../handlers/update-driver.handler";
import {deleteDriverHandler} from "../handlers/delete-driver.handler";

// Отдельный роутер для маршрутов, связанных с водителями.
export const driversRouter = Router({});

driversRouter
    .get(DRIVERS_ROUTES.ROOT, getDriverListHandler)

    .get(DRIVERS_ROUTES.BY_ID, getDriverHandler)

    .post(DRIVERS_ROUTES.ROOT, createDriverHandler)

    .put(DRIVERS_ROUTES.BY_ID, updateDriverHandler)

    .delete(DRIVERS_ROUTES.BY_ID, deleteDriverHandler);
