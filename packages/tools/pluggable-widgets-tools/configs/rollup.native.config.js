import { join } from "path";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const {
    package: { packagePath, widgetName },
    sourcePath,
    widgetEntry
} = require("./variables");

export default args => {
    const production = Boolean(args.prod);
    delete args.prod;

    return ["ios", "android"].map(os => ({
        input: widgetEntry,
        output: {
            format: "esm",
            file: join(
                sourcePath,
                "/dist/tmp/widgets/",
                `${packagePath.replace(/\./g, "/")}/${widgetName.toLowerCase()}/${widgetName}.${os}.js`
            )
        },
        external: ["react", "big.js", "react-native"],
        plugins: [
            nodeResolve({
                extensions: [`.${os}.js`, ".js"]
            }),
            babel({
                babelHelpers: "bundled",
                babelrc: false,
                plugins: [
                    // "@babel/plugin-syntax-flow"
                    "@babel/plugin-transform-flow-strip-types",
                    "@babel/plugin-transform-react-jsx"
                ]
            }),
            typescript({ tsconfigOverride: { compilerOptions: { target: "es2019" } } }),
            commonjs(),
            ...(production ? [terser({ mangle: false })] : [])
        ],
        onwarn: function(warning, warn) {
            if (warning.code !== "THIS_IS_UNDEFINED") {
                console.error(`${warning.message} in ${warning.loc.file}:${warning.loc.line}`);
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
                .flatMap(c => c.imports)
                .filter(d => d.startsWith("react-native-"));
            console.log(rnDependencies);
        }
    };
}
