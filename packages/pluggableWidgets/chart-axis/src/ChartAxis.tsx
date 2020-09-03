import { createElement, ReactElement } from "react";
import { VictoryAxis, VictoryLabel } from "victory-native";

export function ChartAxis(): ReactElement {
    return (
        <VictoryAxis
            axisLabelComponent={<VictoryLabel dy={10} />}
            tickValues={[1, 2, 3, 4]}
            tickFormat={["Q1", "Q2", "Q3", "Q4"]}
            label={"Quaters 2019"}
        />
    );
}
