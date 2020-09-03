/**
 * This file was generated from ChartCanvas.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, ReactNode } from "react";

export interface ChartCanvasProps<Style> {
    name: string;
    style: Style[];
    content?: ReactNode;
}

export interface ChartCanvasPreviewProps {
    class: string;
    style: string;
    content: { widgetCount: number; renderer: ComponentType };
}
