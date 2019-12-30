/**
 * This file was generated from ProgressCircle.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { ActionPreview } from "@mendix/pluggable-widgets-typing-generator/dist/typings";
import { ActionValue, DynamicValue } from "mendix";

interface CommonProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex: number;
}

export type ShowContentEnum = "none" | "value" | "percentage" | "customText";

export type TextStyleEnum = "text" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type PositiveBrandStyleEnum = "default" | "primary" | "inverse" | "info" | "success" | "warning" | "danger";

export type NegativeBrandStyleEnum = "default" | "primary" | "inverse" | "info" | "success" | "warning" | "danger";

export interface ProgressCircleContainerProps extends CommonProps {
    value: DynamicValue<BigJs.Big>;
    minimumValue: DynamicValue<BigJs.Big>;
    maximumValue: DynamicValue<BigJs.Big>;
    onClick?: ActionValue;
    showContent: ShowContentEnum;
    customText?: DynamicValue<string>;
    textStyle: TextStyleEnum;
    circleThickness: number;
    positiveBrandStyle: PositiveBrandStyleEnum;
    negativeBrandStyle: NegativeBrandStyleEnum;
    animate: boolean;
}

export interface ProgressCirclePreviewProps {
    class: string;
    style: string;
    styleObject: CSSProperties;
    value: BigJs.Big;
    minimumValue: BigJs.Big;
    maximumValue: BigJs.Big;
    onClick?: ActionPreview;
    showContent: ShowContentEnum;
    customText?: string;
    textStyle: TextStyleEnum;
    circleThickness: number;
    positiveBrandStyle: PositiveBrandStyleEnum;
    negativeBrandStyle: NegativeBrandStyleEnum;
    animate: boolean;
}

export interface VisibilityMap {
    value: boolean;
    minimumValue: boolean;
    maximumValue: boolean;
    onClick: boolean;
    showContent: boolean;
    customText: boolean;
    textStyle: boolean;
    circleThickness: boolean;
    positiveBrandStyle: boolean;
    negativeBrandStyle: boolean;
    animate: boolean;
}
