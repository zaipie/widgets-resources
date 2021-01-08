import { parseStyle } from "@widgets-resources/piw-utils";
import { createElement, ReactElement } from "react";

import { BadgePreviewProps } from "../typings/BadgeProps";
import { Badge } from "./components/Badge";

declare function require(name: string): string;

export const preview = (props: BadgePreviewProps): ReactElement => {
    // TODO: Change PIW preview props typing generation to remove the ts-ignore below
    // @ts-ignore
    const { className, style, type, value, onClick } = props;

    return (
        <Badge
            type={type}
            value={value ? value : ""}
            clickable={onClick != null}
            className={className}
            style={parseStyle(style)}
        />
    );
};

export function getPreviewCss(): string {
    return require("./ui/Badge.css");
}
