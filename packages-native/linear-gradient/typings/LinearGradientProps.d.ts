/**
 * This file was generated from LinearGradient.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { ReactNode } from "react";

interface CommonProps<Style> {
    name: string;
    style: Style[];
}

export interface LinearGradientProps<Style> extends CommonProps<Style> {
    colorStart: string;
    colorEnd: string;
    changeAngle: boolean;
    angle: number;
    content?: ReactNode;
}
