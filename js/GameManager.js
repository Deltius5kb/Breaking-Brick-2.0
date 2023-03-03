class GameManager 
{
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    #m_GameObject;
    #m_MainMenuSimulationObject;

    constructor() 
    {
        this.#m_MainMenuSimulationObject = new MainMenuSimulation();
    }

    // Called every frame from main.js animate()
    update(f_Time) 
    {
        this.#get_delta_time(f_Time);
        this.#m_MainMenuSimulationObject.update(this.#f_DeltaTime);
    }

    // Called every frame from main.js animate()
    draw()
    {
        this.#m_MainMenuSimulationObject.draw();
    }

    // Called from update() every frame 
    #get_delta_time(f_Time)
    {
        this.#f_DeltaTime = f_Time - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = f_Time;
    }
}