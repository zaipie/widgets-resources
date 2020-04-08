// Copied from image-size library (https://github.com/image-size/image-size/blob/a628bfece6d8fd1673a8489cbeee7a537eeddbcc/lib/types/svg.ts) under MIT license

interface Size {
    width: number;
    height: number;
}

interface Attributes {
    width?: number;
    height?: number;
    viewbox?: Size;
}

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;

const extractorRegExps = {
    height: /\sheight=(['"])([^%]+?)\1/,
    root: svgReg,
    viewbox: /\sviewBox=(['"])(.+?)\1/,
    width: /\swidth=(['"])([^%]+?)\1/
};

const INCH_CM = 2.54;
const units: { [unit: string]: number } = {
    cm: 96 / INCH_CM,
    em: 16,
    ex: 8,
    m: (96 / INCH_CM) * 100,
    mm: 96 / INCH_CM / 10,
    pc: 96 / 72 / 12,
    pt: 96 / 72
};

function parseLength(len: string) {
    const m = /([0-9.]+)([a-z]*)/.exec(len);
    if (!m) {
        return undefined;
    }
    return Math.round(parseFloat(m[1]) * (units[m[2]] || 1));
}

function parseViewbox(viewbox: string): Size {
    const bounds = viewbox.split(" ");
    return {
        height: parseLength(bounds[3])!,
        width: parseLength(bounds[2])!
    };
}

function parseAttributes(root: string): Attributes {
    const width = extractorRegExps.width.exec(root);
    const height = extractorRegExps.height.exec(root);
    const viewbox = extractorRegExps.viewbox.exec(root);
    return {
        height: height ? parseLength(height[2]) : undefined,
        viewbox: viewbox ? parseViewbox(viewbox[2]) : undefined,
        width: width ? parseLength(width[2]) : undefined
    };
}
function calculateByViewbox(attrs: Attributes, viewbox: Size): Size {
    const ratio = viewbox.width / viewbox.height;
    if (attrs.width) {
        return {
            height: Math.floor(attrs.width / ratio),
            width: attrs.width
        };
    }
    if (attrs.height) {
        return {
            height: attrs.height,
            width: Math.floor(attrs.height * ratio)
        };
    }
    return {
        height: viewbox.height,
        width: viewbox.width
    };
}

export function calculateSvgDimensions(xml: string): Size {
    const root = extractorRegExps.root.exec(xml);
    if (root) {
        const attrs = parseAttributes(root[0]);
        if (attrs.width && attrs.height) {
            return {
                width: attrs.width,
                height: attrs.height
            };
        }
        if (attrs.viewbox) {
            return calculateByViewbox(attrs, attrs.viewbox);
        }
    }
    return { width: 0, height: 0 };
}
