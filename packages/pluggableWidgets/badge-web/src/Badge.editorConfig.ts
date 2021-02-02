import { StructurePreviewProps } from "@widgets-resources/piw-utils";
import { BadgePreviewProps } from "../typings/BadgeProps";

export function getPreview(values: BadgePreviewProps): StructurePreviewProps {
    return {
        type: "RowLayout",
        columnSize: "grow",
        children: [
            {
                type: "Container",
                children: [
                    {
                        type: "Container",
                        children: [
                            {
                                type: "Text",
                                content: values.value || "   ",
                                fontColor: "#FFF",
                                bold: true
                            }
                        ],
                        padding: values.value ? 9 : 21
                    }
                ],
                backgroundColor: "#264AE5",
                borderRadius: values.type === "badge" ? 20 : 8
            },
            { type: "Container", grow: 2 }
        ]
    };
}
