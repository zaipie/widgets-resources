import { Platform } from "react-native";
import mergeobjects from "../../../core/helpers/_functions/mergeobjects";
import { background, border, contrast, font, spacing } from "../../../core/variables";
import { ContainerType, ImageType, TextType } from "../../../types/widgets";
/*
==========================================================================
    Cards

==========================================================================
*/
export const cardShadow = {
    elevation: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
        width: 0,
        height: 1
    }
};
export const card: ContainerType = {
    container: {
        borderRadius: border.radiusLarge,
        backgroundColor: background.primary,
        // marginBottom: spacing.regular,
        ...Platform.select({
            android: {
                borderWidth: 1,
                borderColor: contrast.lowest
            }
        }),
        ...cardShadow
    }
};
//
// == Elements
// -------------------------------------------------------------------------------------------------------------------//
export const cardImage: ImageType = {
    container: {
        width: "100%",
        overflow: "hidden",
        borderTopLeftRadius: border.radiusLarge,
        borderTopRightRadius: border.radiusLarge
    },
    image: {
        width: "100%",
        height: 106,
        resizeMode: "cover"
    }
};
export const cardImageLarge: ImageType = mergeobjects(cardImage, {
    image: {
        height: 200
    }
});
export const cardImageBackground: ImageType = {
    container: {
        ...cardImage.container,
        borderBottomLeftRadius: border.radiusLarge,
        borderBottomRightRadius: border.radiusLarge
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "cover"
    }
};
export const cardBodyAbsolute: ContainerType = {
    container: {
        position: "absolute",
        end: 0,
        start: 0,
        bottom: 0,
        backgroundColor: "transparent"
    }
};
export const cardTitle: TextType = {
    container: {
        padding: spacing.regular
    },
    text: {
        fontWeight: font.weightSemiBold
    }
};
//
// == Variations
// -------------------------------------------------------------------------------------------------------------------//
// Card Action
export const cardAction: ContainerType = {
    container: {
        maxWidth: "100%",
        height: 104,
        borderWidth: border.width,
        borderColor: border.color,
        borderRadius: border.radiusLarge,
        padding: spacing.regular,
        ...cardShadow
    }
};

export const cardActionImage: ImageType = {
    image: {
        maxHeight: 70,
        resizeMode: "contain"
    }
};
//
// Card Payment
export const cardPaymentImage: ImageType = {
    container: {
        flex: -1,
        maxHeight: 250
    },
    image: {
        width: "100%",
        maxHeight: 250,
        resizeMode: "contain"
    }
};
