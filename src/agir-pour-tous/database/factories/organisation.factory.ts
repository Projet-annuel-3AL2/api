import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {Organisation, OrganisationProps} from "../../models/organisation.model";

define(Organisation, (faker: typeof Faker, context: OrganisationProps) => {
    const organisation = new Organisation()
    organisation.name = context.name || faker.lorem.word(250);
    return organisation;
});
