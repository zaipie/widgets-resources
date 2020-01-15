import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { ValueStatus } from "mendix";
import { createElement, PureComponent } from "react";
import { View, Text } from "react-native";
import { RNCamera } from "react-native-camera";

import { BarcodeScannerProps } from "../typings/BarcodeScannerProps";
import { BarcodeScannerStyle, defaultBarcodeScannerStyle } from "./ui/styles";
import { executeAction } from "@widgets-resources/piw-utils";

export type Props = BarcodeScannerProps<BarcodeScannerStyle>;

export class BarcodeScanner extends PureComponent<Props> {
    private readonly styles = flattenStyles(defaultBarcodeScannerStyle, this.props.style);
    private readonly onBarCodeReadHandler = this.onBarCodeRead.bind(this);

    render(): JSX.Element {
        return (
            <View style={this.styles.container}>
                <RNCamera
                    testID={this.props.name}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    captureAudio={false}
                    onBarCodeRead={this.onBarCodeReadHandler}
                >
                    {({ status }) => {
                        if (status !== "READY") {
                            return (
                                <View>
                                    <Text>Loading</Text>
                                </View>
                            );
                        }
                    }}
                </RNCamera>
            </View>
        );
    }

    private onBarCodeRead(event: { data: string }): void {
        if (
            this.props.barcode.status !== ValueStatus.Available ||
            this.props.barcode.readOnly ||
            event.data === this.props.barcode.value
        ) {
            return;
        }

        this.props.barcode.setValue(event.data);

        executeAction(this.props.onDetect);
    }
}
