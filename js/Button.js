const ButtonStates = {
    PlayMainMenu: false,
    SettingsMainMenu: false,
    BackLevelSelect: false,
    CreateLevelSelect: false,
    BackLevelCreate: false,
    SaveLevelCreate: false,
    QuitPauseMenu: false,
    ContinuePauseMenu: false,
    SettingsPauseMenu: false,
    BackFinishedMenu: false
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