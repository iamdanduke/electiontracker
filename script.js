const majorParties = [
    "conservativeandunionistparty",
    "labourparty",
    "liberaldemocrats",
    "greenparty",
    "scottishnationalparty(snp)",
    "plaidcymru-thepartyofwales",
    "ukindependenceparty(ukip)",
    "reformuk",
    "independent",
    "labourandco-operativeparty"
];

const partyColors = {
    "conservativeandunionistparty": "#0087dc",
    "labourparty": "#e4003b",
    "liberaldemocrats": "#faa61a",
    "greenparty": "#6AB023",
    "scottishnationalparty(snp)": "#FDF38E",
    "plaidcymru-thepartyofwales": "#3F8428",
    "ukindependenceparty(ukip)": "#70147A",
    "reformuk": "#12B6CF",
    "independent": "#DDDDDD",
    "labourandco-operativeparty": "#e4003b",  // Same as Labour
    "other": "#AAAAAA"  // Default color for any other parties
};

// Initialize seat counts
const seatCounts = {
    "conservativeandunionistparty": 0,
    "labourparty": 0,
    "liberaldemocrats": 0,
    "greenparty": 0,
    "scottishnationalparty(snp)": 0,
    "plaidcymru-thepartyofwales": 0,
    "ukindependenceparty(ukip)": 0,
    "reformuk": 0,
    "independent": 0,
    "labourandco-operativeparty": 0,
    "other": 0
};

const otherParties = {};

function updateSeatCount(party, increment) {
    if (!majorParties.includes(party)) {
        if (!otherParties[party]) {
            otherParties[party] = 0;
        }
        otherParties[party] += increment;
        party = "other";
    }

    if (party === "labourandco-operativeparty") {
        seatCounts["labourparty"] += increment;
        document.getElementById("labourparty-seats").textContent = seatCounts["labourparty"];
    } else {
        seatCounts[party] += increment;
        document.getElementById(`${party}-seats`).textContent = seatCounts[party];
    }
    reorderSeatTracker();
}

function reorderSeatTracker() {
    const seatCountsList = document.getElementById('seat-counts');
    const parties = Array.from(seatCountsList.children);

    // Sort parties based on the number of seats
    parties.sort((a, b) => {
        const aSeats = parseInt(a.querySelector('span').textContent);
        const bSeats = parseInt(b.querySelector('span').textContent);
        return bSeats - aSeats;
    });

    // Clear the list and re-append the sorted parties
    seatCountsList.innerHTML = '';
    parties.forEach(party => seatCountsList.appendChild(party));

    // Add gold border to the party with the most seats
    if (parties.length > 0) {
        parties.forEach(party => party.style.border = 'none'); // Reset borders
        parties[0].style.border = '2px solid gold'; // Gold border for the party with the most seats
    }
}

function markWinner(constituencyId, partyClass) {
    const constituency = document.getElementById(constituencyId);
    const candidates = constituency.querySelectorAll('li');
    const isWinnerSelected = constituency.getAttribute('data-winner-selected') === 'true';

    if (isWinnerSelected) {
        // If winner is already selected, show all candidates again
        candidates.forEach(candidate => {
            candidate.style.display = '';
        });
        constituency.className = 'constituency';
        constituency.style.borderColor = '#ccc';  // Reset border color
        constituency.setAttribute('data-winner-selected', 'false');

        // Decrement seat count for the previously selected party
        updateSeatCount(partyClass, -1);
    } else {
        // Hide all candidates except the selected one
        candidates.forEach(candidate => {
            if (candidate.dataset.party === partyClass) {
                candidate.style.display = '';
            } else {
                candidate.style.display = 'none';
            }
        });
        constituency.className = 'constituency ' + partyClass;
        constituency.style.borderColor = partyColors[partyClass] || partyColors['other'];
        constituency.setAttribute('data-winner-selected', 'true');

        // Increment seat count for the selected party
        updateSeatCount(partyClass, 1);
    }
}

function initializeSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        const constituencies = document.querySelectorAll('.constituency');

        constituencies.forEach(constituency => {
            const constituencyName = constituency.querySelector('h2').textContent.toLowerCase();
            if (constituencyName.includes(query)) {
                constituency.style.display = '';
            } else {
                constituency.style.display = 'none';
            }
        });
    });
}

function toggleTheme() {
    const body = document.body;
    const toggleButton = document.getElementById('toggle-theme');
    const sunIcon = toggleButton.querySelector('.fa-sun');
    const moonIcon = toggleButton.querySelector('.fa-moon');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    } else {
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
    }
}

function toggleOtherParties() {
    const otherPartiesContainer = document.getElementById('other-parties-container');
    const otherPartiesList = document.getElementById('other-parties-list');
    otherPartiesContainer.classList.toggle('hidden');

    // Convert the otherParties object into an array and sort by the number of seats
    const sortedOtherParties = Object.keys(otherParties).map(party => {
        return { party, seats: otherParties[party] };
    }).sort((a, b) => b.seats - a.seats);

    // Populate the other parties list
    otherPartiesList.innerHTML = '';
    sortedOtherParties.forEach(item => {
        const partyItem = document.createElement('li');
        partyItem.textContent = `${item.party}: ${item.seats}`;
        otherPartiesList.appendChild(partyItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-theme');
    toggleButton.addEventListener('click', toggleTheme);

    // Load the HTML content dynamically
    fetch('constituencies.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('constituencies').innerHTML = data;
            initializeSearch();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
