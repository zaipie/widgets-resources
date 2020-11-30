import { createContext, Dispatch, useContext } from "react";
import { ObjectItem, ListAttributeValue } from "mendix";

export const FilterContext = createContext({
    value: "",
    filterDispatcher: (undefined as any) as Dispatch<FilterFunction>
} as FilterContext);

(window as any)["com.mendix.widgets.web.datagrid.filterContext"] = FilterContext;

export interface FilterContext {
    value: string;
    filterDispatcher: Dispatch<FilterFunction>;
}

export interface FilterFunction {
    filter(item: ObjectItem, attribute: ListAttributeValue): boolean;
    valueToStore: string;
}

export function useFilterDispatcher(): FilterContext {
    const filterContext = (window as any)["com.mendix.widgets.web.datagrid.filterContext"] as
        | typeof FilterContext
        | undefined;
    return useContext(ensure(filterContext));
}

function ensure<T>(value: T | undefined): T {
    if (value == null) {
        throw new Error();
    }
    return value;
}
