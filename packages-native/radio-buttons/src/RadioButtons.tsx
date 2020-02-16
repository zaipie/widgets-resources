import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { Component, createElement } from "react";
import { Text, View } from "react-native";

// import SegmentedControlTab from "react-native-segmented-control-tab";
// @ts-ignore
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from "react-native-simple-radio-button";

import { RadioButtonsProps } from "../typings/RadioButtonsProps";
import { defaultRadioButtonsStyle, RadioButtonsStyle } from "./ui/Styles";
import { executeAction } from "@widgets-resources/piw-utils";

export type Props = RadioButtonsProps<RadioButtonsStyle>;

export class RadioButtons extends Component<Props> {
    private readonly onChangeHandler = this.onChange.bind(this);
    private readonly styles = flattenStyles(defaultRadioButtonsStyle, this.props.style);

    private get universe(): string[] {
        // As this property can only be an Enum we know that universe is defined
        return this.props.enum.universe!;
    }

    render(): JSX.Element {
        const selectedIndex = this.universe.indexOf(this.props.enum.value!);
        const captions = this.universe.map(name => ({ value: name, label: this.props.enum.formatter.format(name) }));
        const enabled = this.props.editable !== "never" && !this.props.enum.readOnly;

        return (
            <View style={enabled ? this.styles.container : this.styles.containerDisabled} testID={this.props.name}>
                {/* <SegmentedControlTab
                    values={captions}
                    selectedIndex={selectedIndex}
                    enabled={enabled}
                    onTabPress={this.onChangeHandler}
                    borderRadius={this.styles.container.borderRadius}
                    tabStyle={this.styles.button}
                    tabTextStyle={this.styles.text}
                    activeTabStyle={this.styles.activeButton}
                    activeTabTextStyle={this.styles.activeButtonText}
                /> */}
                <RadioForm animation={true}>
                    {/* To create radio buttons, loop through your array of options */}
                    {captions.map((obj, i) => (
                        <RadioButton labelHorizontal={true} key={i}>
                            {/*  You can set RadioButtonLabel before RadioButtonInput */}
                            <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={selectedIndex === i}
                                onPress={this.onChangeHandler}
                                // borderWidth={1}
                                // buttonInnerColor={"#e74c3c"}
                                // buttonOuterColor={selectedIndex === i ? "#2196f3" : "#000"}
                                // buttonSize={40}
                                // buttonOuterSize={80}
                                // buttonStyle={{}}
                                // buttonWrapStyle={{ marginLeft: 10 }}
                            />
                            <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={this.onChangeHandler}
                                // labelStyle={{ fontSize: 20, color: "#2ecc71" }}
                                // labelWrapStyle={{}}
                            />
                        </RadioButton>
                    ))}
                </RadioForm>
                {this.props.enum.validation && (
                    <Text style={this.styles.validationMessage}>{this.props.enum.validation}</Text>
                )}
            </View>
        );
    }

    private onChange(_value: string, index: number): void {
        console.log("onchange", _value, index);
        const value = this.universe[index];
        this.props.enum.setValue(value);

        executeAction(this.props.onChange);
    }
}
