class GameManager 
{
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    #m_GameObject;
    #m_MainMenuSimulationObject;

    #b_MainMenuActive;

    constructor() 
    {
        this.#m_MainMenuSimulationObject = new MainMenuSimulation();
        this.#m_GameObject = new Game();

        unhide_html_element("main-menu");
        unhide_html_element("main-menu-canvas");
        this.#b_MainMenuActive = true;
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
            }

            if (ButtonStates.BackLevelSelect)
            {
                ButtonStates.BackLevelSelect = false;
                hide_html_element("level-select-menu");
                unhide_html_element("main-menu");
                unhide_html_element("main-menu-canvas");
            }

            if (ButtonStates.CreateLevelSelect)
            {
                ButtonStates.CreateLevelSelect = false;
                hide_html_element("level-select-menu");
                unhide_html_element("level-create-menu");
            }
        }

        if (this.#b_MainMenuActive)
        {
            this.#m_MainMenuSimulationObject.update(this.#f_DeltaTime);
            this.#m_MainMenuSimulationObject.draw();
        }
    }

    // Called from update() every frame 
    #get_delta_time(f_Time)
    {
        this.#f_DeltaTime = f_Time - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = f_Time;
    }
}