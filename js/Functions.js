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

function get_color_from_health(i_Health)
{
    let str_Color;
    switch (i_Health)
    {
        default:
            str_Color = "Grey";
            break;
        case 1:
            str_Color = "Purple";
            break;
        case 2:
            str_Color = "Lime";
            break;
        case 3:
            str_Color = "Pink";
            break;
        case 4:
            str_Color = "Yellow";
            break;
        case 5:
            str_Color = "Hot Pink";
            break;
        case 6:
            str_Color = "Orange";
            break;
        case 7:
            str_Color = "Blue";
            break;
        case 8:
            str_Color = "Green";
            break;
        case -1:
            str_Color = "#ffffff";
            break;
    }
    return str_Color;
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
