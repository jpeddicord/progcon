import alertify from 'alertify.js';

export function alertServerError(err) {
  console.error(err);

  // don't surface browser/javascript errors, that's just dumb
  if (err.server) {
    alertify.error(err.message);
  }
}
