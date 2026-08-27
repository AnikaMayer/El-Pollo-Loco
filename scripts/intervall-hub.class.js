export class IntervalHub {
    static allIntervals = []; // speichert alle registrierten Intervall-IDs

    // startet ein neues Intervall
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer); // setInterval wird hier einmalig fetsgelegt
        IntervalHub.allIntervals.push(newInterval); // jedes neue Interval wird dem Array hinzugefügt
    }

    // stoppt alle registrierten Intervalle und leert den Array
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}
