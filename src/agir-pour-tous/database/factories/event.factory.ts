import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {Event, EventProps} from "../../models/event.model";

define(Event, (faker: typeof Faker, context: EventProps) => {
    const event = new Event();
    event.name = context.name || faker.lorem.word(50);
    event.startDate = context.startDate || faker.date.recent(-1);
    event.endDate = context.endDate || faker.date.future();
    event.latitude = context.latitude || faker.random.number({min: -90, max: 90, precision: 0.00000001});
    event.longitude = context.longitude || faker.random.number({min: -180, max: 180, precision: 0.00000001});
    return event;
});
