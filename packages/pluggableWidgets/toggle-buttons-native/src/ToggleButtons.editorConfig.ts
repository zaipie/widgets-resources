import { StructurePreviewProps } from "@widgets-resources/piw-utils";

export function getPreview(): StructurePreviewProps {
    return {
        type: "RowLayout",
        borders: false,
        borderRadius: 8,
        children: ["1", "2", "3"].map(num => ({
            type: "Container",
            borders: true,
            padding: 4,
            backgroundColor: num === "1" ? "#264AE5" : undefined,
            children: [
                {
                    type: "Text",
                    fontColor: num === "1" ? "#FFF" : "#264AE5",
                    content: `Option ${num}`
                }
            ]
        }))
    };
}
