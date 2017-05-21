/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as Router from 'koa-router';
import { authMiddleware } from './auth';
import adminRoutes from './admin';
import contestRoutes from './contest';
import publicRoutes from './public';

const routes = new Router({prefix: '/api'});

// a fun error handler
// just kidding it isn't really all that fun
routes.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    ctx.status = status;
    if (status === 500) {
      console.error(err);
      ctx.body = 'Internal error';
    } else {
      ctx.body = err.message.trim();
    }
  }
});

routes.use(publicRoutes);

/* * * * * * * * * * * * * * * * * * * */
// auth required for routes below this
routes.use(authMiddleware);
/* * * * * * * * * * * * * * * * * * * */

routes.use(contestRoutes);
routes.use(adminRoutes);

export default routes.routes();
