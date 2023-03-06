class GameManager 
{
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    #m_GameObject;
    #m_MainMenuSimulationObject;

    #b_MainMenuActive;
    #b_GameActive;
    #b_GamePaused;
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
        this.#b_GamePaused = false;

        this.#b_LevelCreateActive = false;
        this.#b_SavingLevel = false;

        set_all_levels_to_default_state();

        this.#enable_main_menu();
    }

    // Called every frame from main.js animate()
    update(f_Time) 
    {
        this.#get_delta_time(f_Time);

        this.#check_buttons();
        this.#check_level_select_buttons();
        this.#update_active_scene();
        this.#update_level_creator();
    }

    #check_buttons()
    {
        if (ButtonStates.PlayMainMenu)
        {
            ButtonStates.PlayMainMenu = false;
            this.#disable_main_menu();
            this.#enable_level_select_menu();
        }

        if (ButtonStates.BackLevelSelect)
        {
            ButtonStates.BackLevelSelect = false;

            this.#disable_level_select_menu();

            if (!this.#b_SavingLevel)
            {
                this.#enable_main_menu();
            }
            else 
            {
                this.#enable_level_create();
                this.#b_SavingLevel = false;
            }
        }

        if (ButtonStates.CreateLevelSelect)
        {
            ButtonStates.CreateLevelSelect = false;

            this.#disable_level_select_menu();
            this.#enable_level_create();

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
            this.#disable_level_create();
            this.#enable_level_select_menu();
        }

        if (ButtonStates.SaveLevelCreate)
        {
            ButtonStates.SaveLevelCreate = false;

            this.#disable_level_create();
            hide_html_element("level-select-create");
            this.#enable_level_select_menu();
            this.#b_SavingLevel = true;
        }

        if (ButtonStates.ContinuePauseMenu)
        {
            ButtonStates.ContinuePauseMenu = false;
            this.#disable_pause_menu();
            this.#enable_game_ui();
        }

        if (ButtonStates.BackPauseMenu)
        {
            ButtonStates.BackPauseMenu = false;
            this.#disable_pause_menu();
            this.#enable_level_select_menu();
        }

        if (ButtonStates.ContinueFinishedMenu)
        {
            ButtonStates.ContinueFinishedMenu = false;
            this.#disable_game_finished_menu();
            this.#enable_pause_menu();
        }
    }

    #check_level_select_buttons()
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
                update_level_div(m_SELECTED_LEVEL.i_Level);
                this.#disable_level_select_menu();
                this.#enable_game_ui();
            }
            m_SELECTED_LEVEL.i_Level = 0;
        }
    }

    #update_active_scene()
    {
        // If on main menu
        if (this.#b_MainMenuActive)
        {
            this.#m_MainMenuSimulationObject.update(this.#f_DeltaTime);
            this.#m_MainMenuSimulationObject.draw();
        }

        // If in game
        if (this.#b_GameActive)
        {
            if (!this.#b_GamePaused)
            {
                this.#m_GameObject.update(this.#f_DeltaTime);
                this.#m_GameObject.draw();

            }
            // If game needs to be paused/unpaused
            if (KeyStates.esc)
            {
                KeyStates.esc = false;
                if (this.#b_GamePaused)
                {
                    this.#disable_pause_menu();
                    this.#enable_game_ui();
                }
                else
                {
                    this.#enable_pause_menu();
                    this.#disable_game_ui();
                }
            }

            if (this.#m_GameObject.check_if_level_completed())
            {
                this.#disable_game_ui();
                this.#disable_pause_menu();
                update_final_score_div(this.#m_GameObject.get_score());
                this.#enable_game_finished_menu();
            }
        }
    }

    #update_level_creator()
    {
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

    #get_delta_time(f_Time)
    {
        this.#f_DeltaTime = f_Time - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = f_Time;
    }

    #enable_main_menu()
    {
        unhide_html_element("main-menu");
        unhide_html_element("main-menu-canvas");
        this.#b_MainMenuActive = true;
    }

    #disable_main_menu()
    {
        hide_html_element("main-menu");
        hide_html_element("main-menu-canvas");
        this.#b_MainMenuActive = false;
    }

    #enable_level_select_menu()
    {
        unhide_html_element("level-select-menu");
    }

    #disable_level_select_menu()
    {
        hide_html_element("level-select-menu");
    }

    #enable_level_create()
    {
        unhide_html_element("level-create-menu");
        this.#b_LevelCreateActive = true;
    }

    #disable_level_create()
    {
        hide_html_element("level-create-menu");
        this.#b_LevelCreateActive = false;
    }

    #enable_game_ui()
    {
        unhide_html_element("game-ui");
        unhide_html_element("game-canvas");
        this.#b_GameActive = true;
    }

    #disable_game_ui()
    {
        hide_html_element("game-ui");
        hide_html_element("game-canvas");
        this.#b_GameActive = false;
    }

    #enable_pause_menu()
    {
        unhide_html_element("pause-menu");
        this.#b_GamePaused = true;
    }

    #disable_pause_menu()
    {
        hide_html_element("pause-menu");
        this.#b_GamePaused = false;
    }

    #enable_game_finished_menu()
    {
        unhide_html_element("game-finished-menu");
    }

    #disable_game_finished_menu()
    {
        hide_html_element("game-finished-menu");
    }

}