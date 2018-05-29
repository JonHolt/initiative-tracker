var initiatives = [];

// Roll 3d4 to determine a base initiative value. 3-12 weighted toward the middle.
function roll3d4() {
	var a = (Math.floor(Math.random() * 4) + 1),
			b = (Math.floor(Math.random() * 4) + 1),
			c = (Math.floor(Math.random() * 4) + 1);
	return a + b + c;
}

// Sort initiatives
function sort() {
	initiatives.sort(function(a, b) {
		return a.init - b.init;
	});
}

// Add a new creature into the combat and roll its initial initiative
function addInitiative(name, mod, isEvent) {
	// roll an initiative
	// subtract the mod
	var initiative = isEvent ? mod : roll3d4() - mod;
	// add init object to array
	initiatives.push({
		name: name,
		mod: mod,
		init: initiative,
		event: isEvent
	});
	// sort by init ascending
	sort();
	redrawList();
}

// Cycle to the next turn
function nextTurn() {
	var current = initiatives[0];
	var reduction = current.init;
	if (current.event) {
		initiatives.shift();
	}
	// Subtract lowest initiative value from all objects
	initiatives.forEach(function(creature) {
		creature.init -= reduction;
	})
	// Roll new initiative for the one that just played
	current.init = roll3d4() - current.mod;
	// Re-sort and redraw the list
	sort();
	redrawList();
}

function redrawList() {
	var list = document.getElementById('initiativeList');
	list.innerHTML = '';
	initiatives.forEach(function(creature) {
		list.innerHTML += `
		<li class="initiative">
			<span class="value">${creature.init}</span>
			<span class="name">${creature.name}</span>
		</li>
		`;
	});
}

document.getElementById('addPlayer').addEventListener('click', function(e) {
	var name = document.getElementById('newName');
	var mod = document.getElementById('newMod');
	var isEvent = document.getElementById('isEvent');
	addInitiative(name.value, mod.value, isEvent.checked);
	name.value = '';
	mod.value = 0;
	isEvent.checked = false;
});

document.getElementById('nextTurn').addEventListener('click', nextTurn);