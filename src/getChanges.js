import {uniq, flatten} from 'lodash';

const is_primitive = (x) => typeof x !== 'object'

let getChanges = (current, next) => {
  if (current === next) {
    return [];
  }

  const both_primitive = is_primitive(current) || is_primitive(next)
  if (both_primitive && current !== next) {
    return [{
      type: 'overwrite',
      path: [],
      value: next,
    }];
  }

  const all_keys = uniq([...Object.keys(current), ...Object.keys(next)]);

  return flatten(all_keys.map(key => {
    const current_value = current[key];
    const next_value = next[key];
    return getChanges(current_value, next_value).map(change => {
      return {
        type: change.type,
        value: change.value,
        path: [key, ...change.path],
      };
    });
  }));
}

export default getChanges
