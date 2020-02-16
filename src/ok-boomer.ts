import { Request, Response, NextFunction } from 'express';

export function okBoomer(req: Request, res: Response, next: NextFunction) {
    /**
     * A small amount of complexity here, where we need to modify `res.send`
     * Ensures we intercept a 200 response and set the message correctly
     */
    const oldSend = res.send;
    const modifiedSend =  (data: any) => {
        if (res.statusCode === 200) {
            res.statusMessage = 'OK Boomer';
        }

        // Use the original send method
        return oldSend.apply(res, [data]);
    }

    res.send = modifiedSend;

    next();
};