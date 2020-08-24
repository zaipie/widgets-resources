/**
 * This file was generated from Charts.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ListValue, ListAttributeValue } from "mendix";

export interface ChartsProps<Style> {
    name: string;
    style: Style[];
    data: ListValue;
    xAttribute: ListAttributeValue<string | any | boolean | Date | BigJs.Big>;
    yAttribute: ListAttributeValue<string | any | boolean | Date | BigJs.Big>;
}

export interface ChartsPreviewProps {
    class: string;
    style: string;
    data: {} | null;
    xAttribute: string;
    yAttribute: string;
}
