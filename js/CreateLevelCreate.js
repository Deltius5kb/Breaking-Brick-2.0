let m_SelectedBrick = null;
let m_ClickedBrick = null;
let a_Click = [];

function make_level_creation_bricks()
{
    let element = document.getElementById("bricks");
    for (let row = 0; row < 6; row++)
    {
        let thisRow = [];
        for (let column = 0; column < 12; column++)
        {
            let m_ThisBrick = document.createElement("div");
            m_ThisBrick.setAttribute("class", "brick");
            m_ThisBrick.setAttribute("row", row);
            m_ThisBrick.setAttribute("column", column);

            m_ThisBrick.onclick = function (event)
            {
                let x = Number(event.currentTarget.getAttribute("column"));
                let y = Number(event.currentTarget.getAttribute("row"));
                a_Click = [x, y];
                m_ClickedBrick = event.currentTarget;
                m_ClickedBrick.style.backgroundColor = d_ColoursHTMLIndexed[Number(m_SelectedBrick.getAttribute("health"))];
                console.log(a_Click);
            };
            element.appendChild(m_ThisBrick);
            thisRow.push(m_ThisBrick);
        }
    }
}

make_level_creation_bricks();

let div = document.getElementById("selection");

// Adds column headers
{
    let headerRow = document.createElement("div");
    headerRow.setAttribute("class", "selection-row");

    let brickLabel = document.createElement("div");
    brickLabel.setAttribute("class", "column-header");
    brickLabel.innerHTML = "Brick";
    headerRow.appendChild(brickLabel);

    let healthLabel = document.createElement("div");
    healthLabel.setAttribute("class", "column-header");
    healthLabel.innerHTML = "Health";
    headerRow.appendChild(healthLabel);
    div.appendChild(headerRow);
}

// Adds selection bricks themselves
for (let i_Health = -1; i_Health < 9; i_Health++)
{
    let s_Colour;
    // Gets colour of this brick
    {
        if (i_Health == -1)
        {
            s_Colour = "#ffffff";
        }
        else
        {
            s_Colour = d_ColoursHTMLIndexed[i_Health];
        }
    }

    let m_BrickDesc;
    // Make brick description
    {
        m_BrickDesc = document.createElement("div");
        // If first
        if (i_Health == -1)
        {
            m_BrickDesc.innerHTML = "REMOVE";
        }
        else
        {
            m_BrickDesc.innerHTML = i_Health;
        }
        m_BrickDesc.setAttribute("class", "label");
    }

    let m_ThisBrick;
    // Make brick itself
    {
        m_ThisBrick = document.createElement("div");
        m_ThisBrick.setAttribute("class", "brick");
        m_ThisBrick.setAttribute("health", i_Health);
        // If first 
        if (i_Health == -1)
        {
            m_ThisBrick.style.backgroundColor = "#ffffff";
        }
        else
        {
            m_ThisBrick.style.backgroundColor = s_Colour;
        }

        m_ThisBrick.style.border = "5px solid transparent";

        m_ThisBrick.onclick = function (event)
        {
            if (m_SelectedBrick.getAttribute("health") == -1)
            {
                m_SelectedBrick.style.border = "5px solid transparent";
            }
            m_SelectedBrick.setAttribute("class", "brick");
            m_SelectedBrick = event.currentTarget;
            if (m_SelectedBrick.getAttribute("health") == -1)
            {
                m_SelectedBrick.style.border = "5px solid #808080";
            }
            else
            {
                event.currentTarget.setAttribute("class", "brick selected");
            }
        };

        if (i_Health == 0)
        {
            m_SelectedBrick = m_ThisBrick;
            m_ThisBrick.setAttribute("class", "brick selected");
        }
    }

    let m_Row;
    // Make row
    {
        m_Row = document.createElement("div");
        m_Row.setAttribute("class", "selection-row");
        m_Row.appendChild(m_ThisBrick);
        m_Row.appendChild(m_BrickDesc);
    }

    div.appendChild(m_Row);
}
