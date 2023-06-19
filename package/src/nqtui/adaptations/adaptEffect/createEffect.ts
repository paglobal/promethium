import executeFns from "./executeFns";
import sendSignal from "./sendSignal";
import setInitialParameters from "../setInitialParameters";
import setCleanupSet from "../setCleanupSet";
import {
  ComponentFnExecuteFn,
  DepArray,
  InternalEffectObject,
  EffectFn,
  ExecuteFn,
} from "./effectTypes";

export default function createEffect<T = any, U extends any[] = any[]>(
  type: "async" | "sync" | "render",
  tracking: "implicit" | "depArray" | "componentFn",
  fn: EffectFn<T, U>,
  depArray?: DepArray<U>
) {
  const execute = executeFns[tracking];

  const effect: InternalEffectObject<T, U> = {
    //whether or not the effect hasn't been ran before
    firstRun: true,
    //whether the effect is async, sync or a render effect
    type,
    //how the effect is tracked (refer to the `tracking` variable above)
    tracking,
    //how many children the effect has
    childCount: 0,
    //the number "n" that shows that the effect is the "nth" child of its parent effect
    position: null,
    //how deeply nested the effect is (starting from level one)
    level: null,
    //tree-like map data structure that contains the cleanups for every effect in the effect tree
    cleanupTree: null,
    //array of digits that point to the effect's cleanup in the effect tree's cleanup tree
    cleanupTreeNodePointer: null,
    //subscription sets (async, sync, render, or memo) of every state currently tracking this effect
    observableSubscriptionSets: new Set(),
    //used to track the number of state values of states currently tracking the effect that are stale
    staleStateValuesCount: 0,
    //used to notify the effect when a state value of state currently tracking the effect turns
    //stale or freshens up after turning stale
    sendSignal: (signal: "fresh" | "stale"): void =>
      sendSignal(
        effect,
        execute as ExecuteFn | ComponentFnExecuteFn,
        fn,
        signal,
        depArray
      ),
  };

  //create `cleanupTreeNodePointer` for effect and create `cleanupTree` for effect tree is this is the
  //topmost parent effect (father of the whole tree)
  setInitialParameters(effect);
  //create `cleanupSet` for effect if it doesn't already exist
  setCleanupSet(effect);

  //return effect `execute` function and effect itself
  return [execute, effect] as const;
}
