const BUI = document.getElementById("BUILDER");

const col1 = document.getElementById("col1");
const col2 = document.getElementById("col2");
const col3 = document.getElementById("col3");

const STY = document.getElementById("STYLE");

col1.insertAdjacentHTML( "beforeend", `
<h1>BOARD ID</h1>
<div>
    <label for="userId">Введите ID:</label>
    <input type="text" id="userId" value="0x0000">
</div>
<hr><hr>
    `);
/*function getId() {
    const userInput = parseInt(document.getElementById("userId").value , 16); 
    return(userInput);
}
*/

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("h1").forEach(h1 => {
        h1.style.cursor = "pointer"; // Сделаем курсор указателем
        h1.addEventListener("click", () => {
            let nextElement = h1.nextElementSibling;
            while (nextElement && nextElement.tagName !== "H1") {
                if (nextElement.style.display === "none") {
                    nextElement.style.display = "";
                } else {
                    nextElement.style.display = "none";
                }
                nextElement = nextElement.nextElementSibling;
            }
        });
    });
});

function parseInput(input) {
    // Удаляем все пробелы из строки
    input = input.replace(/\s+/g, '');

    // Регулярное выражение для поиска устройств, кабелей и конечного ID
    const regex = /(D\d+W\d+)*0x[0-9A-Fa-f]+/g;
    const matches = input.match(regex);

    if (!matches) {
        throw new Error("Invalid input format");
    }

    const result = {
        devices: [],
        cables: [],
        finalId: null
    };

    for (const match of matches) {
        const deviceCablePairs = match.split(/0x[0-9A-Fa-f]+/)[0];
        const finalIdMatch = match.match(/0x[0-9A-Fa-f]+/);

        if (deviceCablePairs) {
            const pairs = deviceCablePairs.match(/D\d+W\d+/g);
            if (pairs) {
                for (const pair of pairs) {
                    const device = pair.match(/D(\d+)/)[1];
                    const cable = pair.match(/W(\d+)/)[1];
                    result.devices.push(parseInt(device, 10));
                    result.cables.push(parseInt(cable, 10));
                }
            }
        }

        if (finalIdMatch) {
            result.finalId = parseInt(finalIdMatch[0], 16);
        }
    }

    return result;
}

function ID_GET_MAP() {
    const userInput = document.getElementById("userId").value;
    const parsedInput = parseInput(userInput);

    const map = new MAPPING();
    for (let i = 0; i < parsedInput.devices.length; i++) {
        map.ARRAY_POINTS.push(new POINT(parsedInput.devices[i], parsedInput.cables[i]));
    }
    map.TO = parsedInput.finalId;

    return map;
    /*
    var map = new MAPPING();
    map.ARRAY_POINTS.push(new POINT(0,2));//2,3 - can
    map.TO = getId();
    */
    return(map);
}