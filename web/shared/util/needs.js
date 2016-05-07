/**
 * Fetch things components "need" for initial render.
 *
 * Needed to pull in data for server-side rendering. Components should
 * speficy a "needs" property containing a list of functions to call.
 * Each function is passed one argument (params) and should return a
 * promise that resolves on completion. Functions will be run as
 * redux actions.
 */
export function fetchComponentData(dispatch, components, params) {
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

/**
 * Fetch a single component's needs.
 *
 * Intended for use on client side, inside componentDidMount, for
 * container/connected components. Can fetch data for an object
 * for client renders.
 */
export function fetchNeeds(inst) {
  const needs = inst.constructor.needs;
  const { dispatch, params } = inst.props;
  needs.map(need => dispatch(need(params)));
}
