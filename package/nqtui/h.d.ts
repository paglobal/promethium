import { DirectiveResult } from "lit-html/async-directive.js";
import { TemplateResult } from "lit-html";
import { Component } from "./renderComponent";
export declare const renderComponentNamesAsWrapperComments: (newrenderComponentNamesAsWrapperComments?: boolean | undefined) => boolean | undefined;
declare function hFn(Component: () => () => TemplateResult, props?: null): DirectiveResult;
declare function hFn<Type>(Component: Component<Type>, props: Type): DirectiveResult;
declare const h: typeof hFn;
export default h;
//# sourceMappingURL=h.d.ts.map