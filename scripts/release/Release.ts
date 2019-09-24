// @ts-ignore
/* eslint-disable no-console */
import ghRelease from "gh-release";
import ghauth, { AuthOptions, TokenData } from "ghauth";
import { promises as fs, existsSync, mkdirSync } from "fs";
import { SvnService } from "../svn/SvnService";
import { join } from "path";
import { spawnSync } from "child_process";
import zipFolder from "zip-folder";

main().catch(handleError);

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const target = args[0];
    const description = args.length > 1 ? args[1] : "No notes";
    const packages = ["packages-common", "packages-native", "packages-web", "packages-hybrid"];

    console.log("Target", target);

    const projectPackage = await findPackage(packages, target);
    if (sourceUncommitted()) {
        console.error("Can not create a release with uncommitted source GIT changes");
        return;
    }
    if (projectPackage.config.packages) {
        // const scopes = projectPackage.config.packages.map(p => `--scope=${p}`);
        // // console.log(["lerna", "run", "build:release", ...scopes].join(" "));
        // const releaseProcess = spawnSync("lerna", ["run", "build:release", ...scopes]);
        // console.log("release Process", releaseProcess, String(releaseProcess.stderr), String(releaseProcess.output));
    } else {
        spawnSync("npm", ["run", "build:release"], { cwd: projectPackage.path });
    }

    const project = projectPackage.config.testProjects[0];
    const projectPath = join(projectPackage.path, project.path);
    if (await projectUncommitted(projectPath)) {
        console.error("Can not create a release with uncommitted test project SVN changes");
        return;
    }
    if (projectPackage.moduleName) {
        const dest = join(__dirname, "../../", projectPackage.path, "dist", projectPackage.version);
        exportModule(projectPath, project.name, project.version, projectPackage.moduleName, dest);
    }

    await createChangeLog(description, projectPackage.version, projectPackage.path);
    // console.log("projectPackage", projectPackage);
    await zipTestProjects(projectPackage.path, project.path);

    await releaseWithAuth(await getAuth(), projectPackage);

    console.log(`Version ${projectPackage.version} of ${projectPackage.name} successfully published`);

    process.exit(0);
}

function exportModule(path: string, project: string, version: string, name: string, destination: string): void {
    // return;
    const MENDIX_PATH = process.env.MENDIX_PATH;
    if (!MENDIX_PATH) {
        console.error("MENDIX_PATH is not available, module can not be exported");
        return;
    }

    const mxUtilPath = join(MENDIX_PATH, version, "modeler");
    // console.log("destination", destination);
    const utils = join(mxUtilPath, "mxutil.exe");
    if (!existsSync(utils)) {
        console.error("mxuitls.exe can not be found at path", utils);
        return;
    }
    if (!existsSync(destination)) {
        mkdirSync(destination);
    }
    const moduleProcess = spawnSync("mono", [
        join(mxUtilPath, "mxutil.exe"),
        "create-module-package",
        "--filter-required-libs",
        `--package-dir=${join(destination)}`,
        join(path, project),
        name
    ]);

    console.log("moduleProcess", String(moduleProcess.stderr), String(moduleProcess.output));
}

async function findPackage(packages: string[], target: string): Promise<any> {
    for (const pack of packages) {
        const folders = await fs.readdir(pack);
        for (const folder of folders) {
            const pathToPackage = join(pack, folder);
            try {
                const stat = await fs.stat(join(pathToPackage, "package.json"));
                if (stat) {
                    const contentBuffer = await fs.readFile(join(pathToPackage, "package.json"));
                    const content = JSON.parse(contentBuffer.toString());
                    if (content.name === target) {
                        return {
                            ...content,
                            path: pathToPackage
                        };
                    }
                }
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
    }
    throw Error(`Package for ${target} not found`);
}

function sourceUncommitted(): boolean {
    // return false;
    const gitProcess = spawnSync("git", ["status", "-s"]);
    console.log("gitProcess", String(gitProcess.stderr), String(gitProcess.output));
    return !!String(gitProcess.output);
}

async function projectUncommitted(project: string): Promise<boolean> {
    // return false;
    const svnService = new SvnService("", "");
    const status = readableStatus(await svnService.status(project));
    console.log("SVN project status:", status || "OK");
    return Boolean(status);
}

function readableStatus(status: any): string {
    // console.log(JSON.stringify(status.target.entry));
    let statusMessage = "";
    if (status.target.entry) {
        const project = status.target.$.path;
        statusMessage += `Project: ${project} : \n`;
        status.target.entry.forEach(e => {
            const file = e.$.path.replace(project + "/", "");
            statusMessage += `${e["wc-status"].$.item} ${file} \n`;
        });
    }
    return statusMessage;
}

function getGitBranch(): string {
    const gitBranchProcess = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"]);

    console.log("moduleProcess", String(gitBranchProcess.stderr), String(gitBranchProcess.output));
    return String(gitBranchProcess.output);
}

function getAuth(): Promise<TokenData> {
    return new Promise<TokenData>((resolve, reject) => {
        const options: AuthOptions = {
            configName: "gh-release",
            scopes: ["repo"],
            note: "gh-release",
            userAgent: "gh-release"
        };

        ghauth(options, (error, auth) => (error ? reject(error) : resolve(auth)));
    });
}

async function releaseWithAuth(auth: TokenData, projectPackage: any): Promise<void> {
    // return;
    const tagName = `AppStore release ${projectPackage.name.replace(/^\w/, (c: string) => c.toUpperCase())} v${
        projectPackage.version
    }`;

    const assets = [
        `dist/${projectPackage.version}/${projectPackage.widgetName}.mpk`,
        `dist/${projectPackage.version}/${projectPackage.packagePath}.${projectPackage.widgetName}.mpk`,
        `dist/${projectPackage.version}/${projectPackage.moduleName}.mpk`,
        "dist/tmp/TestProjects.zip"
    ];
    // console.log("assets", assets);
    const branche = getGitBranch();
    const options = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        tag_name: `${projectPackage.name}-v${projectPackage.version}`,
        name: tagName,
        assets: assets.filter(asset => existsSync(projectPackage.path + "/" + asset)),
        auth,
        workpath: projectPackage.path,
        // eslint-disable-next-line @typescript-eslint/camelcase
        target_commitish: branche,
        draft: true
    };

    return new Promise(resolve =>
        ghRelease(options, (error: string, result: { html_url: string }) => {
            if (error) {
                return handleError(error);
            }

            console.log(result.html_url);
            resolve();
        })
    );
}

function handleError(error: any): void {
    console.error(error);
    process.exit(1);
}

function createChangeLog(description: string, version: string, path: string): Promise<void> {
    const date = new Date();
    const body = `## [${version}] - ${date.getFullYear()}-${date.getMonth()}-${date.getDay()}
    ${description}
`;
    return fs.appendFile(`${path}/CHANGELOG.md`, body);
}

async function zipTestProjects(path: string, project: string): Promise<boolean> {
    // return true;
    const source = join(path, project);
    const destination = join(path, "dist", "tmp", "TestProjects.zip");
    return new Promise(resolve => {
        zipFolder(source, destination, (err: string) => {
            if (err) {
                console.log("Error trying to zip testProjects");
                resolve(false);
            }

            console.log("Successfully zipped the TestProjects");
            resolve(true);
        });
    });
}
