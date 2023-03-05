const m_SELECTED_LEVEL = {
    i_Level: 0
};

let m_Table = document.getElementById("table");
let i_Level = 0;

for (let seasonIndex = 0; seasonIndex < a_Seasons.length; seasonIndex++)
{
    let season = a_Seasons[seasonIndex];

    for (let index = 0; index < season.length; index++)
    {
        i_Level += 1;

        // Makes elements in form:
        // <div class="period 1">
        //     <div class="period-inner">
        //         <div class="title">L1</div>
        //         <div class="desc">Level1</div>
        //     </div>
        // </div>
        let period = document.createElement("div")

        period.setAttribute("class", "period " + convert_int_between_1_and_6_to_word(seasonIndex + 1));
        let period_inner = document.createElement("div")
        period_inner.setAttribute("class", "period-inner");

        let title = document.createElement("div")
        title.setAttribute("class", "title");
        title.innerHTML = season[index].Abbreviation;
        let desc = document.createElement("div")
        desc.setAttribute("class", "desc");
        desc.innerHTML = "Level " + i_Level;

        period_inner.appendChild(title);
        period_inner.appendChild(desc);

        period_inner.setAttribute("level", i_Level)
        period_inner.onclick = function (event)
        {
            m_SELECTED_LEVEL.i_Level = Number(event.currentTarget.getAttribute("level"));
            console.log(m_SELECTED_LEVEL.i_Level);
        };

        period.appendChild(period_inner);
        m_Table.appendChild(period);
    }
}

// Makes empty spaces 
for (let index = 0; index < 4; index++)
{
    let gap = document.createElement("div");
    gap.setAttribute("class", "empty-space-" + (index + 1));
    m_Table.appendChild(gap);
}