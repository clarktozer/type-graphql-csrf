# type-graphql-csrf-middleware

![CI Status](https://img.shields.io/github/workflow/status/clarktozer/type-graphql-csrf-middleware/CI)
[![npm version](https://img.shields.io/npm/v/type-graphql-csrf-middleware.svg)](https://www.npmjs.com/package/type-graphql-csrf-middleware)
[![types included](https://badgen.net/npm/types/type-graphql-csrf-middleware)](https://www.npmjs.com/package/type-graphql-csrf-middleware)

TypeGraphQL middleware for handling csrf tokens with an express server and express-session.

Required Peer Dependencies:

-   express
-   express-session
-   crsf
-   cookie-parser
-   graphql
-   type-graphql

## Installation

```bash
npm install type-graphql-csrf-middleware

yarn add type-graphql-csrf-middleware
```

```javascript
import { ValidAntiForgeryToken } from "type-graphql-csrf-middleware";
```

## Getting Started

Your express server will need to add a csrf token as a cookie and a csrf secret to the session.
Below is an example express route middleware to add the tokens.

```javascript
const addCsrf = (req: Request, res: Response, next: NextFunction) => {
    const tokens = new Tokens();
    const secret = tokens.secretSync();
    const token = tokens.create(secret);

    res.cookie("csrfToken", token);
    req.session.csrfSecret = secret;

    next();
};
```

## Resolver Middleware Use

The type-graphql middleware needs a cookie key and a session key that are used in your express route middleware function like the previous example in order to verify the token.

```javascript
import { ValidAntiForgeryToken } from "type-graphql-csrf-middleware";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    @UseMiddleware(ValidAntiForgeryToken({ cookieKey: "csrfToken", secretKey: "csrfSecret" }))
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        {...}
    }
}
```

The middleware can also be reusable between resolver functions.

```javascript
import { ValidAntiForgeryToken } from "type-graphql-csrf-middleware";

const Authorized = ValidAntiForgeryToken({
    cookieKey: "csrfToken",
    secretKey: "csrfSecret",
    message: "Access Denied!"
});

{...}

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    @UseMiddleware(Authorized)
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        {...}
    }
}
```
