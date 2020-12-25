//#tool "nuget:?package=GitReleaseNotes"
#tool "nuget:?package=GitVersion.CommandLine"
#addin Cake.Npm
#addin nuget:?package=NuGet.Core&version=2.14.0
//#addin nuget:?package=Cake.NSwag.Console
//#addin "Cake.Docker"

GitVersion versionInfo = null;
var target = Argument("target", "Default");
var outputDir = "./artifacts/";
var publishDir = outputDir + "publish/";
var versionFile = outputDir + "version";

Task("Clean")
    .Does(() => {
        if (DirectoryExists(outputDir))
        {
            DeleteDirectory(outputDir, recursive:true);
        }
        CreateDirectory(outputDir);
    });

Task("Version")
    .IsDependentOn("Clean")
    .Does(() => {
        versionInfo = GitVersion(new GitVersionSettings{ OutputType = GitVersionOutput.Json });
        System.IO.File.WriteAllText(versionFile, versionInfo.SemVer);
    });

Task("Install")
    .Does(() => {
        NpmInstall(new NpmInstallSettings {
            Global = false,
            Production = false,
            LogLevel = NpmLogLevel.Info
        });
    });

Task("Lint")
    .IsDependentOn("Install")
    .Does(() => {
        NpmRunScript( new NpmRunScriptSettings {
            ScriptName = "lint"
        });
    });

Task("Test")
    .IsDependentOn("Lint")
    .Does(() => {
        NpmRunScript( new NpmRunScriptSettings {
            ScriptName = "test"
        });
    });

Task("DevBuild")
    .Does(() => {
        NpmRunScript( new NpmRunScriptSettings {
            ScriptName = "build"
        });
    });

Task("ProdBuild")
    .Does(() => {
        NpmRunScript( new NpmRunScriptSettings {
            ScriptName = "build:prod"
        });
    });

Task("CI")
    .IsDependentOn("Test");;

Task("Default")
    .IsDependentOn("Install");

RunTarget(target);