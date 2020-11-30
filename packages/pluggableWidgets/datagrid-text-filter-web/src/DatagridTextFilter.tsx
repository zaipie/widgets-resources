import { createElement, ReactElement } from "react";
import { DatagridTextFilterContainerProps } from "../typings/DatagridTextFilterProps";

import "./ui/DatagridTextFilter.scss";
import { FilterComponent } from "./components/FilterComponent";
import { useFilterDispatcher } from "./utils/provider";

export default function DatagridTextFilter(props: DatagridTextFilterContainerProps): ReactElement {
    const filterContext = useFilterDispatcher();
    return (
        <FilterComponent
            adjustable={props.adjustable}
            defaultFilter={props.defaultFilter}
            delay={props.delay}
            filterDispatcher={filterContext.filterDispatcher}
            name={props.name}
            placeholder={props.placeholder?.value}
            screenReaderButtonCaption={props.screenReaderButtonCaption?.value}
            screenReaderInputCaption={props.screenReaderInputCaption?.value}
            tabIndex={props.tabIndex}
            defaultValue={filterContext.value ?? props.defaultValue?.value}
        />
    );
}
