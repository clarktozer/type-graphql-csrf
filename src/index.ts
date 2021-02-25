import Tokens from "csrf";
import { Request } from "express";
import { MiddlewareFn } from "type-graphql";

interface IContext {
    req: Request;
}

export interface ValidAntiForgeryTokenProps {
    cookieKey: string;
    secretKey: string;
    message?: string;
}

export const ValidAntiForgeryToken = <T extends IContext>({
    cookieKey,
    message = "Unauthorized",
    secretKey
}: ValidAntiForgeryTokenProps): MiddlewareFn<T> => ({ context }, next) => {
    const tokens = new Tokens();
    const token = context.req.cookies[cookieKey];
    const secret = context.req.session[secretKey];

    if (!token || !secret || !tokens.verify(secret, token)) {
        throw new Error(message);
    }

    return next();
};
