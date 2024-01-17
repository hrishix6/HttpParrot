import fs from "fs-extra";
import {exec} from "child_process";

async function generatBuild(browser)
{
    try {
        await fs.emptyDir(`dist.${browser}`);
        await fs.copy("dist",`dist.${browser}`);
        await fs.copy(`${browser}`,`dist.${browser}`);
        console.log(`${browser} build generated`);

        } catch (error) {
            console.log(`${browser} build failed with error ${error}`);
        }
}

async function build(fireFoxOnly, chromeOnly)
{   
    if(!fireFoxOnly && !chromeOnly)
    {
        await generatBuild("chrome");
        await generatBuild("firefox");
    }
    else if(fireFoxOnly)
    {
        await generatBuild("firefox");
    }
    else if(chromeOnly)
    {
        await generatBuild("chrome");
    }
}

function main()
{
        const onlyFirefox = process.argv[2] === "--firefox";
        const onlyChrome = process.argv[2] === "--chrome";

        console.log(process.argv);

        const command = "npm run build";
        const child = exec(command, (error, stdout, stderr)=> {
            if(error)
            {
                console.log(error);
                return;
            }
           if(stderr)
           {
                console.log(error);
                return;
           }
        });

        console.log("building client...");

        child.on("exit",(code)=> {
            if(code == 0)
            {
                console.log("done building client, now generating extension package...");
                build(onlyFirefox, onlyChrome);
            }   
            else
            {
                console.log("build process didn't finish with success.");
            }
        });

        child.on("error",(err)=> {
            console.log(err);
        });
}

main();