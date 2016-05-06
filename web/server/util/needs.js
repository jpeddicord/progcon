/**
 * Fetch things a component "needs" for initial render.
 *
 * Needed to pull in data for server-side rendering. Components should
 * speficy a "needs" property containing a list of functions to call.
 * Each function is passed one argument (params) and should return a
 * promise that resolves on completion. Functions will be run as
 * redux actions.
 */
export default function fetchComponentData(dispatch, components, params) {
  const promises = components.reduce((list, current) => {
    // break open redux-connected components to get their needs
    if (current.WrappedComponent != null && current.WrappedComponent.needs != null) {
      for (let need of current.WrappedComponent.needs) {
        list.push(dispatch(need(params)));
      }
    }

    return list;
  }, []);

  return Promise.all(promises);
}
