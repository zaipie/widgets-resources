import { createElement, ReactElement } from "react";
import { VictoryChart } from "victory-native";

import { ChartCanvasProps } from "../typings/ChartCanvasProps";

export function ChartCanvas(props: ChartCanvasProps<undefined>): ReactElement {
    return (
        <VictoryChart>
            {props.content}
            {props.content2}
        </VictoryChart>
    );
}
