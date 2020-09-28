const { join } = require("path");
const babel = require("@rollup/plugin-babel").default;
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const nodeBuiltinModules = require("builtin-modules");
const copy = require("rollup-plugin-copy");
const { terser } = require("rollup-plugin-terser");
const typescript = require("rollup-plugin-typescript2");
const {
    package: { packagePath, widgetName },
    sourcePath,
    widgetEntry
} = require("./variables");

const out = join(sourcePath, "/dist/tmp/widgets/");

module.exports = args => {
    const production = Boolean(args.prod);
    delete args.prod;

    return ["ios", "android"].map(os => ({
        input: widgetEntry,
        output: {
            format: "esm",
            file: join(out, `${packagePath.replace(/\./g, "/")}/${widgetName.toLowerCase()}/${widgetName}.${os}.js`)
        },
        // todo: should have a system to handle dependencies like react-native-firebase
        external: [
            "react",
            "big.js",
            /^react-native($|\/)/,
            /^mendix($|\/)/,
            ...nodeBuiltinModules,
            "react-native-firebase"
        ],
        plugins: [
            json(),
            nodeResolve({
                extensions: [`.${os}.js`, ".js"],
                preferBuiltins: true
            }),
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
            if (["CIRCULAR_DEPENDENCY", "THIS_IS_UNDEFINED"].includes(warning.code)) {
                warn(warning);
            } else {
                console.error(warning.toString());
                process.exit(1);
            }
        }
    }));
};

function copyReactNativeModules() {
    return {
        name: "copy-react-native-modules",
        async resolveId(source) {
            if (!source.startsWith("react-native-")) {
                return null;
            }
            return { id: source, external: true };
        },
        async generateBundle(_, bundle) {
            const rnDependencies = Object.values(bundle)
                .flatMap(c => c.consts)
                .filter(d => d.startsWith("react-native-"));
            console.log(rnDependencies);
        }
    };
}
