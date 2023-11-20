function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      let temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
  
    return array;
}

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
function random()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}


class StudentGame {
    constructor(boxen, nTries) {
        this.maxTries = nTries;
        this.currentTry = 0;
        this.boxen = boxen;
        this.opened = Array(boxen.lenth).map(n => false);
        this.yourNumber = Math.floor(Math.random() * boxen.length)+1;
    }

    nBoxen() {
        return this.boxen.length;
    }

    open(number) {
        this.currentTry += 1;
        this.opened[number-1] = true;
        return this.boxen[number-1];
    }

    is_opened(number) {
        return this.opened[number-1];
    }

    tries_left() {
        return this.maxTries - this.currentTry;
    }

    your_number() {
        return this.yourNumber;
    }

    is_ongoing() {
        return this.tries_left() > 0 && !this.is_success();
    }

    is_success() {
        for (let i=0; i<this.boxen.length; i++) {
            if (this.boxen[i] === this.yourNumber) {
                return this.opened[i];
            }
        }
    }
}

function isASCII(str) { return /^[\x00-\x7F]+$/.test(str); }

let GAME = undefined;
let LAST_ELEMENT = undefined;
let HIGHTLIGHT_LAST_ELEMENT = undefined;
let SHOW_BOX_NUMBERING = undefined;

function toggleStartForm() {
    $("#game-field").toggle();
    $("#startForm").toggle();
}

function openBox(event) {
    let num = (+$(event).attr('number'));
    if (!GAME.is_opened(num) && GAME.is_ongoing()) {
        $(event).html(getOpenedBox(num, GAME.open(num), SHOW_BOX_NUMBERING));
        updateTriesDisplay();
        updateLastElement($(event));
        updateStatusDisplay();
    }
}

function updateStatusDisplay() {
    let text = "Ongoing";
    if (!GAME.is_ongoing()) {
        text = GAME.is_success() ? "<span class='won'>Won!</span>" : "<span class='loose'>Loose :(</span>";
    }
    $("#gameStatus").html(text);
}

function updateLastElement(event) {
    if (LAST_ELEMENT !== undefined) {
        if (event.attr("number") === LAST_ELEMENT.attr("number")) {
            return;
        }
        LAST_ELEMENT.removeClass('lastClicked');
        LAST_ELEMENT.addClass('previouslyClicked');
    }
    LAST_ELEMENT = event;
    let highlight = HIGHTLIGHT_LAST_ELEMENT ? 'lastClicked' : 'previouslyClicked';
    LAST_ELEMENT.addClass(highlight);
}

function updateTriesDisplay() {
    $("#triesLeft").text(`Tries left: ${GAME.tries_left()}`)
}

function updateYourNumberDisplay() {
    $("#yourNumber").text(`Your number: ${GAME.your_number()}`)
}

function getOpenedBox(number, content, showBoxNumbering) {
    return $(`
        <div style='position: relative; text-align: center;'>
            <div style='position: absolute; bottom: 6%; left: 50%; transform: translate(-50%, -50%); font-size: 2em; z-index: 3;'>${content}</div>
            <img src="Empty cardboard box.svg" style='width: 75px; heigth: 75px; left: 50%; opacity: 0.4;'/>
        </div>
        <div class='boxLabel' ${showBoxNumbering ? "" : "hidden"}>${number}</div>
    `);
}

function getUnopenedBox(number, showBoxNumbering) {
    return $(`
    <div class='box' onclick='openBox(this)' number='${number}'>
        <div style='position: relative; text-align: center;'>
            <div style='position: absolute; bottom: 6%; left: 50%; transform: translate(-50%, -50%);'></div>
            <img src="Empty cardboard box.svg" style='width: 75px; heigth: 75px; left: 50%;'/>
        </div>
        <div class='boxLabel' ${showBoxNumbering ? "" : "hidden"}>${number}</div>
    </div>
    `);
}

function createPlayField(boxen, showBoxNumbering) {
    $("#sim-field").hide();
    for (let i = 0; i<boxen; i++) {
        $("#play-field").append(getUnopenedBox(i+1, showBoxNumbering));
    }
}

function validateNumber(val, min, max ,msg1, msg2) {
    if (!isASCII(val)) { location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; return false; }
    if (String(val).includes(".") || String(val).includes(",") || String(val).includes("f")) { alert("Sneaky sneaky"); return false; }
    let n = +val;
    if (!n) {
        alert(msg1);
        return false;
    }
    if (n < min || n > max) {
        alert(msg2);
        return false;
    }
    return true;
}

function validateInputs() {
    if (!validateNumber($("#anzahlDerBoxenInput").val(), 1, 300, "Sicherlich ein Tippfehler, kein malicous intent :)", "Pls, be reasonable")) { return false; }
    if (!validateNumber($("#anzahlDerVersucheInput").val(), 1, +$("#anzahlDerBoxenInput").val(), "Not here either, try again!", "Hardly a challenge, don't you think?")) { return false; }
    if (!validateNumber($("#anzahlDerSimulationen").val(), 1, 100000, "Almost, maybe try Unicode?", "You just want to watch the world burn, don't you?")) { return false; }
    if (!validateNumber($("#anzahlDerStudenten").val(), 1, 10000, "Really now?", "Seems kinda overkill...")) { return false; }
    if (!validateNumber($("#seedInput").val(), 1, 99999999999, "Idk, what would happen either", "I mean, it's possible, but...")) { return false; }
    return true;
}

$(document).ready(function() {
    $("#game-field").toggle();
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('simulation')) {
        $("#simulation-button").toggle();
        $("#sim-field").toggle();
        $("#sim-studenten").toggle();
        $("#sim-count").toggle();
        $("#simulation-selection").toggle();
    }
    $("#play-button").click(function() {
        if (!validateInputs()) {
            return;
        }
        seed($("#seedInput").val());
        toggleStartForm();
        let nBoxen = +$("#anzahlDerBoxenInput").val();
        let nTries = +$("#anzahlDerVersucheInput").val();
        SHOW_BOX_NUMBERING = $("#showBoxNumbering").is(':checked');
        HIGHTLIGHT_LAST_ELEMENT = $("#showLastBox").is(':checked');

        let boxen = shuffle([...Array(+nBoxen).keys()].map(n => n+1));
        GAME = new StudentGame(boxen, nTries);
        createPlayField(+nBoxen, $("#showBoxNumbering").is(':checked'));
        updateTriesDisplay();
        updateYourNumberDisplay();
        updateStatusDisplay();
    });

    $("#simulation-button").click(function() {
        if (!validateInputs()) {
            return;
        }
        $("#sim-log").html("");
        let nSimulation = +$("#anzahlDerSimulationen").val();
        let nStudenten = +$("#anzahlDerStudenten").val();
        let nBoxen = +$("#anzahlDerBoxenInput").val();
        let nTries = +$("#anzahlDerVersucheInput").val();
        let strat = +$("#stratSelect").val();

        let successesTotal = 0;
        let failuresTotal = 0;
        for (let iSim = 0; iSim < nSimulation; iSim++) {
            let successStudent = 0;
            let failuresStudent = 0;
            seed(Math.random() * 1000000000);
            let boxen = shuffle([...Array(+nBoxen).keys()].map(n => n+1));

            for (let iStudent = 0; iStudent < nStudenten; iStudent++) {
                let game = new StudentGame(boxen, nTries);

                let last_content = game.your_number();
                while (game.is_ongoing()) {
                    let guess = strat === 1 ? getRandomGuess(game) : getRingGuess(game, last_content);
                    last_content = game.open(guess);
                }

                if (game.is_success()) {
                    successStudent += 1;
                } else {
                    failuresStudent += 1;
                }
            }
            $("#sim-log").append($(`<tr><th scope="row">${iSim}</th><td>${Math.floor(successStudent / (successStudent + failuresStudent) * 100)}%</td><td>${successStudent}</td><td>${failuresStudent}</td></tr>`))

            if (failuresStudent>0) {
                failuresTotal += 1;
            } else {
                successesTotal += 1;
            }
        }

        $("#winrate-total-display").text(`Winrate: ${(((successesTotal * 1.0) / ((successesTotal + failuresTotal) * 1.0)) * 100).toFixed(2)}%`);
        $("#wins-total-display").text(`Win: ${successesTotal}`);
        $("#loss-total-display").text(`Loss: ${failuresTotal}`);
    });
});

function getRandomGuess(game) {
    let guess = Math.floor(random() * game.nBoxen() + 1);
    while (game.is_opened(guess)) {
        guess = Math.floor(random() * game.nBoxen() + 1);
    }
    return guess;
}

function getRingGuess(game, last_content) {
    return last_content;
}