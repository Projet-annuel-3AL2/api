import {User} from "./user.model";
import {Event} from "./event.model";
import {Organisation} from "./organisation.model";
import {Post} from "./post.model";

export type SearchResult = {
    users: User[];
    events: Event[];
    organisations: Organisation[];
    posts: Post[];
}
