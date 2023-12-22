import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import prisma from "./database";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new Strategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: jwtPayload.userId,
                },
            });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);