class GameManager 
{
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    #m_GameObject;
    #m_MainMenuSimulationObject;

    #b_MainMenuActive;
    #b_GameActive;
    #b_LevelCreateActive;
    #b_SavingLevel;

    #a_LevelToLoadBricks;
    #a_LevelCreationBricks;

    constructor() 
    {
        this.#a_LevelCreationBricks = [];
        this.#a_LevelToLoadBricks = [];

        this.#m_MainMenuSimulationObject = new MainMenuSimulation();
        this.#m_GameObject = new Game();

        this.#b_MainMenuActive = true;
        this.#b_GameActive = false;
        this.#b_LevelCreateActive = false;
        this.#b_SavingLevel = false;

        // unhide_html_element("main-menu");
        // unhide_html_element("main-menu-canvas");

        unhide_html_element("pause-menu");
    }

    // Called every frame from main.js animate()
    update(f_Time) 
    {
        this.#get_delta_time(f_Time);

        // Check buttons
        {
            if (ButtonStates.PlayMainMenu)
            {
                ButtonStates.PlayMainMenu = false;
                hide_html_element("main-menu");
                hide_html_element("main-menu-canvas");
                unhide_html_element("level-select-menu");
                this.#b_MainMenuActive = false;
            }

            if (ButtonStates.BackLevelSelect)
            {
                ButtonStates.BackLevelSelect = false;

                hide_html_element("level-select-menu");
                if (!this.#b_SavingLevel)
                {
                    unhide_html_element("main-menu");
                    unhide_html_element("main-menu-canvas");
                    this.#b_MainMenuActive = true;
                }
                else 
                {
                    unhide_html_element("level-create-menu");
                    this.#b_SavingLevel = false;
                }
            }

            if (ButtonStates.CreateLevelSelect)
            {
                ButtonStates.CreateLevelSelect = false;
                hide_html_element("level-select-menu");
                unhide_html_element("level-create-menu");
                this.#b_LevelCreateActive = true;

                // Reset level selection 
                document.getElementById("bricks").remove();
                let m_BrickDiv = document.createElement("div");
                m_BrickDiv.setAttribute("id", "bricks");
                document.getElementById("level-create-menu").appendChild(m_BrickDiv);
                make_level_creation_bricks();
            }

            if (ButtonStates.BackLevelCreate)
            {
                ButtonStates.BackLevelCreate = false;
                hide_html_element("level-create-menu");
                unhide_html_element("level-select-menu");
                this.#b_LevelCreateActive = false;
            }

            if (ButtonStates.SaveLevelCreate)
            {
                ButtonStates.SaveLevelCreate = false;
                this.#b_LevelCreateActive = false;
                hide_html_element("level-create-menu");
                hide_html_element("level-select-create");
                unhide_html_element("level-select-menu");
                this.#b_SavingLevel = true;
            }
        }

        // Check level select buttons
        {
            // If player selected a level
            if (m_SELECTED_LEVEL.i_Level != 0)
            {
                // If player saving level
                if (this.#b_SavingLevel)
                {
                    save_level_to_localstorage(`${m_SELECTED_LEVEL.i_Level}`, this.#a_LevelCreationBricks);
                    this.#a_LevelCreationBricks = [];
                    this.#b_SavingLevel = false;
                    unhide_html_element("level-select-create");
                }

                else
                {
                    this.#a_LevelToLoadBricks = load_level_from_localstorage(`${m_SELECTED_LEVEL.i_Level}`);
                    this.#m_GameObject.set_level_array(this.#a_LevelToLoadBricks);
                    this.#b_GameActive = true;
                    update_level_div(m_SELECTED_LEVEL.i_Level);
                    hide_html_element("level-select-menu");
                    unhide_html_element("game-ui");
                    unhide_html_element("game-canvas");
                }
                m_SELECTED_LEVEL.i_Level = 0;
            }
        }

        // If on main menu
        if (this.#b_MainMenuActive)
        {
            this.#m_MainMenuSimulationObject.update(this.#f_DeltaTime);
            this.#m_MainMenuSimulationObject.draw();
        }

        // If in game
        if (this.#b_GameActive)
        {
            this.#m_GameObject.update(this.#f_DeltaTime);
            this.#m_GameObject.draw();
        }

        // If player is on level creation screen
        if (this.#b_LevelCreateActive)
        {
            // Checks if player clicked on brick
            {
                let i_ActiveBrickHealth = Number(m_SelectedBrick.getAttribute("health"));

                if (m_ClickedBrick != null)
                {
                    // If selected brick isnt deletion tool
                    if (i_ActiveBrickHealth != -1)
                    {
                        // Adds brick to array of bricks
                        let m_ThisBrick = {
                            vec2_GridLocation: new THREE.Vector2(a_Click[0], a_Click[1]),
                            i_Health: i_ActiveBrickHealth
                        };
                        this.#a_LevelCreationBricks.push(m_ThisBrick);
                    }

                    // If selected brick is deletion tool, removes brick that was clicked on
                    else
                    {
                        // Looks through every brick to check if location matches clicklocation
                        for (let i = 0; i < this.#a_LevelCreationBricks.length; i++)
                        {
                            if (this.#a_LevelCreationBricks[i].vec2_GridLocation.x == a_Click[0] && this.#a_LevelCreationBricks[i].vec2_GridLocation.y == a_Click[1])
                            {
                                this.#a_LevelCreationBricks.splice(i, 1);
                                break;
                            }
                        }
                    }
                    m_ClickedBrick = null;
                    a_Click = [];
                    console.table(this.#a_LevelCreationBricks);
                }
            }
        }
    }

    // Called from update() every frame 
    #get_delta_time(f_Time)
    {
        this.#f_DeltaTime = f_Time - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = f_Time;
    }
}