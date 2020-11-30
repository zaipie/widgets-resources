import { createElement, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { DatagridContainerProps } from "../typings/DatagridProps";

import "./ui/Datagrid.scss";
import { Table } from "./components/Table";
import classNames from "classnames";
import { FilterContext, FilterFunction } from "./components/provider";
import { Filters } from "react-table";

export default function Datagrid(props: DatagridContainerProps): ReactElement {
    const isServerSide = !(props.columnsFilterable || props.columnsSortable);
    const isInfiniteLoad = !props.pagingEnabled && isServerSide;
    const currentPage = isInfiniteLoad
        ? props.datasource.limit / props.pageSize
        : props.datasource.offset / props.pageSize;
    const customFiltersState = props.columns.map(() => useState<FilterFunction>());
    const [filters, setFilters] = useState<Filters<object>>([]);

    useState(() => {
        if (isServerSide) {
            if (props.datasource.limit === Number.POSITIVE_INFINITY) {
                props.datasource.setLimit(props.pageSize);
            }
        } else {
            props.datasource.setLimit(undefined);
            props.datasource.setOffset(0);
        }
    });

    useEffect(() => {
        const newFilters = customFiltersState.map((cf, index) => ({
            id: index.toString(),
            value: cf[0]?.valueToStore ?? ""
        }));

        if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
            setFilters(newFilters);
        }
    }, [customFiltersState, filters]);

    const setPage = useCallback(
        computePage => {
            const newPage = computePage(currentPage);
            if (isInfiniteLoad) {
                props.datasource.setLimit((newPage + 1) * props.pageSize);
            } else {
                props.datasource.setOffset(newPage * props.pageSize);
            }
        },
        [props.datasource, props.pageSize, isInfiniteLoad, currentPage]
    );

    const items = useMemo(
        () =>
            (props.datasource.items ?? []).filter(item =>
                customFiltersState.every(
                    ([customFilter], columnIndex) =>
                        !customFilter || customFilter.filter(item, props.columns[columnIndex].attribute)
                )
            ),
        [props.datasource, props.columns, customFiltersState]
    );

    return (
        <Table
            className={props.class}
            cellRenderer={useCallback(
                (renderWrapper, value, columnIndex) => {
                    const column = props.columns[columnIndex];
                    return renderWrapper(
                        column.hasWidgets && column.content ? (
                            column.content(value)
                        ) : (
                            <span className="td-text">{column.attribute(value).displayValue}</span>
                        ),
                        classNames(props.rowClass?.(value)?.value, column.columnClass?.(value)?.value)
                    );
                },
                [props.columns, props.rowClass]
            )}
            columns={props.columns}
            columnsDraggable={props.columnsDraggable}
            columnsFilterable={props.columnsFilterable}
            columnsHidable={props.columnsHidable}
            columnsResizable={props.columnsResizable}
            columnsSortable={props.columnsSortable}
            data={items}
            emptyPlaceholderRenderer={useCallback(renderWrapper => renderWrapper(props.emptyPlaceholder), [
                props.emptyPlaceholder
            ])}
            filterRenderer={useCallback(
                (renderWrapper, columnIndex) => {
                    const column = props.columns[columnIndex];
                    const [, setValue] = customFiltersState[columnIndex];
                    const value = filters.find(f => f.id === columnIndex.toString())?.value ?? "";
                    return renderWrapper(
                        <FilterContext.Provider value={{ value, filterDispatcher: setValue }}>
                            {column.filter}
                        </FilterContext.Provider>
                    );
                },
                [props.columns, props.datasource, filters]
            )}
            filters={filters}
            hasMoreItems={props.datasource.hasMoreItems ?? false}
            numberOfItems={props.datasource.totalCount}
            page={currentPage}
            pageSize={props.pageSize}
            paging={props.pagingEnabled}
            pagingPosition={props.pagingPosition}
            settings={props.configurationAttribute}
            setFilters={setFilters}
            setPage={setPage}
            styles={props.style}
            valueForSort={useCallback(
                (value, columnIndex) => {
                    const column = props.columns[columnIndex];
                    return column.attribute(value).value;
                },
                [props.columns]
            )}
        />
    );
}
