const { basename, dirname, extname, join } = require("path");
const { lstatSync } = require("fs");
const babel = require("@rollup/plugin-babel").default;
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const { copy: copyFile } = require("fs-extra");
const copy = require("rollup-plugin-copy");
const { terser } = require("rollup-plugin-terser");
const typescript = require("rollup-plugin-typescript2");
const {
    package: { packagePath, widgetName },
    sourcePath,
    widgetEntry
} = require("./variables");

// This list is minimal - we include only modules that cannot be duplicated
const MODULES_SHIPPED_WITH_CLIENT = [
    "react",
    "big.js",
    "react-native",
    "react-native-gesture-handler",
    "react-native-reanimated"
];

const out = join(sourcePath, "/dist/tmp/widgets/");

module.exports = args => {
    const production = Boolean(args.prod);
    delete args.prod;

    return {
        input: widgetEntry,
        output: {
            format: "esm",
            file: join(out, `${packagePath.replace(/\./g, "/")}/${widgetName.toLowerCase()}/${widgetName}.js`)
        },
        external: [...MODULES_SHIPPED_WITH_CLIENT, /^react-native($|\/)/, /^mendix($|\/)/],
        plugins: [
            copyReactNativeModules({ dest: join(out, "node_modules") }),
            nodeResolve({ browser: true, preferBuiltins: false }),
            json(),
            babel({
                babelHelpers: "bundled",
                babelrc: false,
                plugins: [
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-transform-flow-strip-types",
                    "@babel/plugin-transform-react-jsx"
                ]
            }),
            typescript({ tsconfigOverride: { compilerOptions: { target: "es2019" } } }),
            commonjs(),
            copy({
                targets: [
                    {
                        src: `${sourcePath}/src/**/*.xml`.replace(/\\/g, "/"),
                        dest: out
                    }
                ]
            }),
            ...(production ? [terser({ mangle: false })] : [])
        ],
        onwarn: function(warning, warn) {
            if (["CIRCULAR_DEPENDENCY", "THIS_IS_UNDEFINED", "UNUSED_EXTERNAL_IMPORT"].includes(warning.code)) {
                warn(warning);
            } else {
                console.error(warning);
                process.exit(1);
            }
        }
    };
};

function copyReactNativeModules({ dest }) {
    return {
        name: "copy-react-native-modules",
        async resolveId(source) {
            if (!source.startsWith("react-native-")) {
                return null;
            }
            return { id: source, external: true };
        },
        async writeBundle(_, bundle) {
            const nativeDependencies = Object.values(bundle)
                .flatMap(c => c.imports.concat(c.dynamicImports))
                .filter(d => d.startsWith("react-native-"))
                .map(d => d.split("/")[0]);

            const packagedToCopy = withTransitiveDependencies(nativeDependencies);
            withTransitiveDependencies(MODULES_SHIPPED_WITH_CLIENT, true).forEach(d => packagedToCopy.delete(d));

            await copyPackages(packagedToCopy, dest);
        }
    };
}

function withTransitiveDependencies(packages, allowUnresolved = false) {
    const queue = Array.from(packages);
    const result = new Set();
    while (queue.length) {
        const package = queue.shift();
        if (result.has(package)) {
            continue;
        }
        result.add(package);
        try {
            queue.push(...Object.keys(require(`${package}/package.json`).dependencies ?? {}));
        } catch (e) {
            // package is not resolved
            if (!allowUnresolved) {
                throw e;
            }
        }
    }
    return result;
}

async function copyPackages(packages, dest) {
    return Promise.all(
        Array.from(packages).map(package => {
            const from = dirname(require.resolve(`${package}/package.json`));
            const to = join(dest, package);
            return copyFile(from, to, {
                filter: path =>
                    lstatSync(path).isDirectory()
                        ? !["android", "ios", ".github", "__tests__"].includes(basename(path))
                        : [".js", ".jsx", ".ts", ".tsx", ".json"].includes(extname(path))
            });
        })
    );
}
