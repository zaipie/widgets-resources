import { ReactNode, useCallback, createElement } from "react";
import { executeAction } from "@widgets-resources/piw-utils";
import { ValueStatus } from "mendix";

import { BadgeContainerProps } from "../typings/BadgeProps";
import { Badge as DisplayBadge } from "./components/Badge";

export default function Badge(props: BadgeContainerProps): ReactNode {
    const onClick = useCallback(() => {
        executeAction(props.onClick);
    }, [props.onClick]);

    return (
        <DisplayBadge
            type={props.type}
            value={props.value && props.value.status === ValueStatus.Available ? props.value.value : ""}
            clickable={props.onClick && props.onClick.canExecute}
            onClick={onClick}
            className={props.class}
            style={props.style}
        />
    );
}
