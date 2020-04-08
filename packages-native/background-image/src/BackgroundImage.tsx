import { createElement } from "react";
import { View, StyleSheet, Image as RNImage } from "react-native";
import { ValueStatus } from "mendix";
import { Image } from "mendix/components/native/Image";
import { flattenStyles } from "@native-mobile-resources/util-widgets";

import { BackgroundImageStyle, defaultBackgroundImageStyle } from "./ui/Styles";
import { BackgroundImageProps } from "../typings/BackgroundImageProps";
import { calculateSvgDimensions } from "./utils/svgUtils";

interface Dimensions {
    width: string | number | undefined;
    height: string | number | undefined;
}

export function BackgroundImage(props: BackgroundImageProps<BackgroundImageStyle>): JSX.Element | null {
    const styles = flattenStyles(defaultBackgroundImageStyle, props.style);
    const image = props.image;
    let opacity = Number(props.opacity.toFixed());
    const dimensions: Dimensions =
        typeof image.value === "number"
            ? RNImage.resolveAssetSource(image.value as number)
            : calculateSvgDimensions(image.value as string);

    if (opacity < 0) {
        opacity = 0;
    } else if (opacity > 1) {
        opacity = 1;
    }

    if (image.status !== ValueStatus.Available || !image.value) {
        return null;
    }

    const imageStyle = {
        aspectRatio: (dimensions.width as number) / (dimensions.height as number),
        opacity,
        resizeMode: props.resizeMode,
        ...styles.image
    };

    dimensions.height =
        imageStyle.width &&
        typeof imageStyle.width === "string" &&
        (!imageStyle.height || typeof imageStyle.height !== "string")
            ? undefined
            : imageStyle.height;
    dimensions.width =
        imageStyle.height &&
        typeof imageStyle.height === "string" &&
        (!imageStyle.width || typeof imageStyle.width !== "string")
            ? undefined
            : imageStyle.width;

    return (
        <View style={styles.container} testID={props.name}>
            <Image
                source={image.value}
                style={[imageStyle, dimensions]}
                color={styles.image.svgColor}
                testID={`${props.name}$image`}
            />
            <View style={StyleSheet.absoluteFill}>{props.content}</View>
        </View>
    );
}
