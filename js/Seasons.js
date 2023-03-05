const m_SELECTED_LEVEL = {
    i_Level: 0
};

let season1 = [
    {
        Name: "Pilot",
        Abbreviation: "Pi"
    },
    {
        Name: "The Cat's in the Bag",
        Abbreviation: "Cb"
    },
    {
        Name: "And the Bag's in the River",
        Abbreviation: "Br"
    },
    {
        Name: "Cancer Man",
        Abbreviation: "Cm"
    },
    {
        Name: "Gray Matter",
        Abbreviation: "Gm"
    },
    {
        Name: "Crazy Handful of Nothin'",
        Abbreviation: "Ch"
    },
    {
        Name: "A No-Rough-Stuff-Type Deal",
        Abbreviation: "Nr"
    },
];

let season2 = [
    {
        Name: "Seven Thirty-Seven",
        Abbreviation: "Sv"
    },
    {
        Name: "Grilled",
        Abbreviation: "G"
    },
    {
        Name: "Bit by a Dead Bee",
        Abbreviation: "Bb"
    },
    {
        Name: "Down",
        Abbreviation: "Dn"
    },
    {
        Name: "Breakage",
        Abbreviation: "Bk"
    },
    {
        Name: "Peekaboo",
        Abbreviation: "Pkb"
    },
    {
        Name: "Negro y Azul",
        Abbreviation: "Na"
    },
    {
        Name: "Better Call Saul",
        Abbreviation: "Bcs"
    },
    {
        Name: "4 Days Out",
        Abbreviation: "Do"
    },
    {
        Name: "Over",
        Abbreviation: "O"
    },
    {
        Name: "Mandala",
        Abbreviation: "M"
    },
    {
        Name: "Phoenix",
        Abbreviation: "P"
    },
    {
        Name: "ABQ",
        Abbreviation: "Abq"
    },
];

let season3 = [
    {
        Name: "No Mas",
        Abbreviation: "Nm"
    },
    {
        Name: "Caballo Sin Nombre",
        Abbreviation: "Cn"
    },
    {
        Name: "I.F.T",
        Abbreviation: "If"
    },
    {
        Name: "Green Light",
        Abbreviation: "Gl"
    },
    {
        Name: "Mas",
        Abbreviation: "Ma"
    },
    {
        Name: "Sunset",
        Abbreviation: "S"
    },
    {
        Name: "One Minute",
        Abbreviation: "Om"
    },
    {
        Name: "I See You",
        Abbreviation: "Icu"
    },
    {
        Name: "Kafkaesque",
        Abbreviation: "K"
    },
    {
        Name: "Fly",
        Abbreviation: "F"
    },
    {
        Name: "Abiquiu",
        Abbreviation: "Ab"
    },
    {
        Name: "Half Measures",
        Abbreviation: "Hm"
    },
    {
        Name: "Full Measure",
        Abbreviation: "Fm"
    },
];

let season4 = [
    {
        Name: "Box Cutter",
        Abbreviation: "Bc"
    },
    {
        Name: "Thirty-Eight Snub",
        Abbreviation: "Ts"
    },
    {
        Name: "Open House",
        Abbreviation: "Oh"
    },
    {
        Name: "Bullet Points",
        Abbreviation: "Bp"
    },
    {
        Name: "Shotgun",
        Abbreviation: "Sg"
    },
    {
        Name: "Cornered",
        Abbreviation: "C"
    },
    {
        Name: "Problem Dog",
        Abbreviation: "Pd"
    },
    {
        Name: "Hermanos",
        Abbreviation: "H"
    },
    {
        Name: "Bug",
        Abbreviation: "B"
    },
    {
        Name: "Salud",
        Abbreviation: "Sa"
    },
    {
        Name: "Crawl Space",
        Abbreviation: "Cs"
    },
    {
        Name: "End Times",
        Abbreviation: "Et"
    },
    {
        Name: "Face Off",
        Abbreviation: "Fo"
    },
];

let season5 = [
    {
        Name: "Live Free or Die",
        Abbreviation: "Lfd"
    },
    {
        Name: "Madrigal",
        Abbreviation: "Ml"
    },
    {
        Name: "Hazard Pay",
        Abbreviation: "Hp"
    },
    {
        Name: "Fifty One",
        Abbreviation: "Fio"
    },
    {
        Name: "Dead Freight",
        Abbreviation: "Df"
    },
    {
        Name: "Buyout",
        Abbreviation: "Bo"
    },
    {
        Name: "Say My Name",
        Abbreviation: "Smn"
    },
    {
        Name: "Gliding Over All",
        Abbreviation: "Go"
    },
    {
        Name: "Blood Money",
        Abbreviation: "Blm"
    },
    {
        Name: "Buried",
        Abbreviation: "Bu"
    },
    {
        Name: "Confessions",
        Abbreviation: "Co"
    },
    {
        Name: "Rabid Dog",
        Abbreviation: "Rd"
    },
    {
        Name: "To'hajilee",
        Abbreviation: "Th"
    },
    {
        Name: "Ozymandias",
        Abbreviation: "Ozy"
    },
    {
        Name: "Granite State",
        Abbreviation: "Gs"
    },
    {
        Name: "Felina",
        Abbreviation: "Fe"
    },
];

// Iterated through 
let a_Seasons = [
    season1,
    season2,
    season3,
    season4,
    season5
];

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