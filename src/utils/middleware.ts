import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

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