import { cpSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { render, renderSync } from "node-sass";

const iconsPath = "./src/icons";
const scssPath = "./src/scss";

const copyIcons = async () => {
	await cpSync(scssPath, "./dist/icons", {
		recursive: true,
	});
	console.log("Icons copied");
};

const compileScss = async () => {
	const { css } = await renderSync({
		file: `${scssPath}/io-icons.scss`,
		outFile: "./io-icons.css",
	});

	if (!(await existsSync("./dist/css"))) {
		await mkdirSync("./dist/css");
	}
	await writeFileSync("./dist/css/io-icons.css", css);

	console.log("Scss compiled");
};

const generateIconsScss = async () => {
	let iconsCss = "";
	const folders = await readdirSync(iconsPath);

	for await (const folder of folders) {
		const icons = await readdirSync(join(iconsPath, folder));
		icons.forEach((icon) => {
			const [iconName, ext] = icon.split(".");
			iconsCss += `.io-icon.${iconName} { mask-image: url("../icons/${folder}/${icon}"); -webkit-mask-image: url("../icons/${folder}/${icon}"); }\r\n`;
		});
	}

	await writeFileSync("./dist/css/io-icons-list.css", iconsCss);
};

const main = async () => {
	await copyIcons();
	await compileScss();

	await generateIconsScss();
};

main();
