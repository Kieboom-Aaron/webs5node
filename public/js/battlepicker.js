// De data wordt gerenderd als een JSON String in de view en vervolgens weer terug geconverteerd naar een json object in de view.
// Deze variabele moet ik dan opslaan en mee gaan kutten.

//The variable data contains the entries (enteries) 
var entries = data.enteries;
console.log(entries);

var zeroLost = entries.length;
var oneLost = 0;
var twoLost = 0;

var shownEntries = [];


for (var i = entries.length - 1; i >= 0; i--) {
    entries[i].lossCount = 0;
}

function pickEntry(index) {
    console.log('pickEntry ', index);
    if (index === 0) {
        addLoss(shownEntries[1]);
    } else if (index === 1) {
        addLoss(shownEntries[0]);
    } else {
        console.error('invalid index in pickEntry(index)');
    }
    nextEntries();
}

function addLoss(entry) {
    switch (entry.lossCount) {
        case 0:
            zeroLost--;
            oneLost++;
            break;
        case 1:
            oneLost--;
            twoLost++;
            break;
        case 2:
            twoLost--;
            break;
    }
    entry.lossCount++;
}

function nextEntries() {
    if (zeroLost > 1) {
        shownEntries = getEntries(0);
    } else if (oneLost > 1) {
        shownEntries = getEntries(1);
    } else if (twoLost > 1) {
        shownEntries = getEntries(2);
    } else {
        console.log('you\'re done');
        console.log(entries);
    }
}

function getEntries(lossCount) {
    var nextEntries = [];
    var index = 0;

    for (var i = entries.length - 1; i >= 0; i--) {
        if (lossCount === entries[i].lossCount) {
            nextEntries[index] = entries[i];
            index++;
        }
        if (nextEntries.length === 2) {
            return nextEntries;
        }
    }
    console.error('no valid entries found');
}

nextEntries();
showEntries();




function showEntries() {
	var callbackzero = function(data) {
	    pickEntry(0);
	};
	var callbackone = function(data) {
	    pickEntry(1);
	};
	for (var i = shownEntries.length - 1; i >= 0; i--) {
	    var card = $('#card' + i).children();
	    console.log(card);
	    shownEntries[i].sequence = i;
	    card[0].src = shownEntries[i].image;
	    card[1].innerHTML = shownEntries[i].title;

	    if (i === 0) {
	        card[2].addEventListener("click", callbackzero, false);
	    } else {
	        card[2].addEventListener("click", callbackone, false);
	    }
	}
}



// function indexLossCount() {
//     var zeroLost = 0;
//     var oneLost = 0;
//     var twolost = 0;
//     for (var i = entries.length - 1; i >= 0; i--) {

//         switch (entries[i].lossCount) {
//             case 0:
//                 zeroLost++;
//                 break;
//             case 1:
//                 oneLost++;
//                 break;
//             case 2:
//                 twoLost++;
//                 break;
//         }
//     }
//     return [zeroLost, oneLost, twoLost];
// }