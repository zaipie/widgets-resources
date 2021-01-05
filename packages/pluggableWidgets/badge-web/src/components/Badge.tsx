import { createElement, CSSProperties, ReactElement } from "react";
import classNames from "classnames";

import "../ui/Badge.css";

export interface BadgeProps {
    type: "badge" | "label";
    className?: string;
    style?: CSSProperties;
    value: string;
    clickable?: boolean;
    onClick?: () => void;
}

export const Badge = (props: BadgeProps): ReactElement => {
    const { type, className, style, value, clickable, onClick } = props;

    return (
        <span
            className={classNames("widget-badge", type, "label-default", className, {
                "widget-badge-clickable": clickable
            })}
            onClick={onClick}
            style={style}
        >
            {value}
        </span>
    );
};
