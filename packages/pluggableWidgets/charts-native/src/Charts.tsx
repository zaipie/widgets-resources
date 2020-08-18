import { createElement, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from "victory-native";

// import { ChartsProps } from "../typings/ChartsProps";

const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }
});

export function Charts(): ReactElement {
    return (
        <View style={styles.container}>
            <VictoryChart width={350} theme={VictoryTheme.material} domainPadding={{ x: 15 }}>
                <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
                    barWidth={20}
                    style={{
                        data: { fill: "#0595DB" }
                    }}
                    animate={{
                        duration: 2000
                    }}
                />
                <VictoryAxis
                    axisLabelComponent={<VictoryLabel dy={20} />}
                    tickValues={[1, 2, 3, 4]}
                    tickFormat={["Q1", "Q2", "Q3", "Q4"]}
                    label={"Quaters 2019"}
                    // style={{ axisLabel: { paddingTop: 200 } }}
                />
                <VictoryAxis
                    dependentAxis
                    axisLabelComponent={<VictoryLabel dy={-30} />}
                    // tickValues={[1, 2, 3, 4]}
                    // tickFormat={["Q1", "Q2", "Q3", "Q4"]}
                    label={"Earnings ($)"}
                    // style={{ axisLabel: { paddingTop: 200 } }}
                />
            </VictoryChart>
        </View>
    );
}
