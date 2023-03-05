/* 
Going to go with a different coding style this time
functions_will_be_snake_case

ObjectsAndClassesWillBePascalCase
Use hungarian notation for everything, can tell properties apart because they use this keyword
*/

function animate(time)
{
    m_GameManager.update(time);
    requestAnimationFrame(animate);
}

const m_LivesImage = document.createElement("img");
m_LivesImage.setAttribute("src", "textures/lives.png");
m_LivesImage.setAttribute("width", 72);
m_LivesImage.setAttribute("height", 60);

let m_GameManager;

window.onload = function ()
{
    m_GameManager = new GameManager();
    console.log("Game loaded");
    requestAnimationFrame(animate);
    if (true)
    {
        console.log("hello");
    }
}