import { randomChoice } from '../utils/common.js';
export const dummySessionRequestHandler = () => {
    const usernames = ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank'];
    return (req, res, next) => {
        const randomUsername = randomChoice(usernames);
        req.sessionContext = {
            user: {
                username: `${randomUsername}_user`,
                email: `${randomUsername}@example.com`,
            },
        };
        next();
    };
};
