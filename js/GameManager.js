class GameManager 
{
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    #m_GameObject;

    constructor() 
    {
        this.#m_GameObject = new Game();
    }

    // Called every frame from main.js animate()
    update(f_Time) 
    {
        this.#get_delta_time(f_Time);
        this.#m_GameObject.update(this.#f_DeltaTime);
    }

    // Called every frame from main.js animate()
    draw()
    {
        this.#m_GameObject.draw();
    }

    // Called from update() every frame 
    #get_delta_time(f_Time)
    {
        this.#f_DeltaTime = f_Time - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = f_Time;
    }
}