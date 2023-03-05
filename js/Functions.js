const d_Colours = {
    "Blue": { color: 0x89a9ff },
    "Pink": { color: 0xE589FF },
    "Lime": { color: 0xA3FF89 },
    "Green": { color: 0x89FFBA },
    "Purple": { color: 0x898DFF },
    "Hot Pink": { color: 0xFF89B3 },
    "Yellow": { color: 0xFFED89 },
    "Orange": { color: 0xFF834B },
    "Grey": { color: 0x808080 },
    "White": { color: 0xffffff }
};

const d_ColoursHTML = {
    "Blue": "#89a9ff",
    "Pink": "#E589FF",
    "Lime": "#A3FF89",
    "Green": "#89FFBA",
    "Purple": "#898DFF",
    "Hot Pink": "#FF89B3",
    "Yellow": "#FFED89",
    "Orange": "#FF834B",
    "Grey": "#808080",
    "White": "#ffffff"
};

// Colours for threejs
const d_ColoursTHREE = {
    0: d_Colours["Grey"],
    1: d_Colours["Purple"],
    2: d_Colours["Lime"],
    3: d_Colours["Pink"],
    4: d_Colours["Yellow"],
    5: d_Colours["Hot Pink"],
    6: d_Colours["Orange"],
    7: d_Colours["Blue"],
    8: d_Colours["Green"]
};

const d_ColoursHTMLIndexed = {
    0: d_ColoursHTML["Grey"],
    1: d_ColoursHTML["Purple"],
    2: d_ColoursHTML["Lime"],
    3: d_ColoursHTML["Pink"],
    4: d_ColoursHTML["Yellow"],
    5: d_ColoursHTML["Hot Pink"],
    6: d_ColoursHTML["Orange"],
    7: d_ColoursHTML["Blue"],
    8: d_ColoursHTML["Green"]
};

function set_all_levels_to_default_state()
{
    let a_LevelBricks = [];
    for (let i = 0; i < 12; i++)
    {
        let m_Brick = {
            vec2_GridLocation: new THREE.Vector2(i, 0),
            i_Health: 2
        };
        a_LevelBricks.push(m_Brick);
    }

    for (let i = 0; i < 62; i++)
    {
        // Make default level
        save_level_to_localstorage(`${i}`, a_LevelBricks);
    }
}

function save_level_to_localstorage(s_LevelName, a_Bricks)
{
    let s_Json = JSON.stringify(a_Bricks);
    localStorage.setItem(s_LevelName, s_Json);
}

function load_level_from_localstorage(s_LevelName)
{
    return JSON.parse(localStorage.getItem(s_LevelName));
}

// Used to convert index into number for css class ids in level select scene
function convert_int_between_1_and_6_to_word(i_Integer)
{
    let s_String;
    switch (i_Integer)
    {
        case 1:
            s_String = "one";
            break;
        case 2:
            s_String = "two";
            break;
        case 3:
            s_String = "three";
            break;
        case 4:
            s_String = "four";
            break;
        case 5:
            s_String = "five";
            break;
        case 6:
            s_String = "six";
            break;
    }
    return s_String;
}

function hide_html_element(s_DivID)
{
    document.getElementById(s_DivID).style.display = "none";
}

function unhide_html_element(s_DivID)
{
    document.getElementById(s_DivID).style.display = "block";
}

function update_timer_div(f_Time)
{
    f_Time = f_Time / 1000;

    let str_Timer = `${Math.round(f_Time)}`;

    if (Math.round(f_Time) < 10)
    {
        str_Timer = "0" + str_Timer;
    }

    document.getElementById("timer").innerHTML = str_Timer;
}

function update_level_div(i_Level)
{
    let str_Level = `LEVEL:${i_Level}`;
    document.getElementById("level").innerHTML = str_Level;
}

function update_score_div(i_Score)
{
    let str_Score = i_Score.toString();
    str_Score = `SCORE:${("0".repeat(4 - str_Score.length))}${str_Score}`;
    document.getElementById("score").innerHTML = str_Score;
}

function update_lives_div(i_NewHealth)
{
    let div = document.getElementById("lives");

    // Removes all lives from the list
    while (div.hasChildNodes())
    {
        div.removeChild(div.children[0]);
    }

    // Adds correct number of lives to list
    for (let index = 0; index < i_NewHealth; index++)
    {
        div.appendChild(m_LivesImage.cloneNode(true));
    }
}

function get_color_material(str_Color)
{
    return new THREE.MeshStandardMaterial(d_Colours[str_Color]);
}

function do_boundingboxes_collide(m_BoundingBox1, m_BoundingBox2)
{
    if (m_BoundingBox1.intersectsBox(m_BoundingBox2) || m_BoundingBox1.containsBox(m_BoundingBox2))
    {
        return true;
    }
    return false;
}

function does_boundingsphere_collide_with_boundingbox(m_BoundingSphere, m_BoundingBoxOfSphere, m_BoundingBox)
{
    if (m_BoundingSphere.intersectsBox(m_BoundingBox) || m_BoundingBox.containsBox(m_BoundingBoxOfSphere))
    {
        return true;
    }
    return false;
}
