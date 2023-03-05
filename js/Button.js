const ButtonStates = {
    PlayMainMenu: false,
    SettingsMainMenu: false,
    BackLevelSelect: false,
    CreateLevelSelect: false,
    BackLevelCreate: false,
    SaveLevelCreate: false,
    BackPauseMenu: false,
    ContinuePauseMenu: false,
    SettingsPauseMenu: false,
    ContinuteFinishedMenu: false
};

document.getElementById("main-menu-play").onclick = function ()
{
    console.log("play button pressed");
    ButtonStates.PlayMainMenu = true;
};

document.getElementById("main-menu-settings").onclick = function ()
{
    console.log("settings button pressed");
    ButtonStates.SettingsMainMenu = true;
};

document.getElementById("level-select-back").onclick = function ()
{
    console.log("back button pressed");
    ButtonStates.BackLevelSelect = true;
};

document.getElementById("level-select-create").onclick = function ()
{
    console.log("create button pressed");
    ButtonStates.CreateLevelSelect = true;
};

document.getElementById("level-create-back").onclick = function ()
{
    console.log("back button pressed");
    ButtonStates.BackLevelCreate = true;
};

document.getElementById("level-create-save").onclick = function ()
{
    console.log("save button pressed");
    ButtonStates.SaveLevelCreate = true;
};

document.getElementById("pause-menu-back").onclick = function ()
{
    console.log("back button pressed");
    ButtonStates.BackPauseMenu = true;
};

document.getElementById("pause-menu-continue").onclick = function ()
{
    console.log("continue button pressed");
    ButtonStates.ContinuePauseMenu = true;
};

document.getElementById("pause-menu-settings").onclick = function ()
{
    console.log("settings button pressed");
    ButtonStates.SettingsPauseMenu = true;
};

document.getElementById("game-finished-continue").onclick = function ()
{
    console.log("continute button pressed");
    ButtonStates.ContinuteFinishedMenu = true;
};