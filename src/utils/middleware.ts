import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { Roleuser } from '@prisma/client';
import {User} from "../classes/user";

export const validateAuthInputs = [
    body('email').notEmpty().withMessage('Le email est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    body('email').isEmail().withMessage('Le email doit être une adresse e-mail valide'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        console.error(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};
export const authorizeRole = (allowedRoles: Roleuser[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;
        // console.log('User Role:', user ? user.roleuser : 'Not authenticated');
        // console.log('Allowed Roles:', allowedRoles);
        if (user && user.roleuser && allowedRoles.includes(user.roleuser)) {
            next();
        } else {
            console.log('Role not allowed');
            res.status(403).json({ error: 'Forbidden' });
        }
    };
};