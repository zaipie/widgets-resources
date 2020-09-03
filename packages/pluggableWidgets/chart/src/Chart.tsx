import { createElement, ReactElement } from "react";
import { VictoryBar } from "victory-native";

const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
];

export function Chart(): ReactElement {
    return (
        <VictoryBar
            data={data}
            x="quarter"
            y="earnings"
            barWidth={20}
            style={{
                data: { fill: "#0595DB" }
            }}
        />
    );
}
