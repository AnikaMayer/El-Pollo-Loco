/**
 * Central static manager for all game intervals.
 * Tracks every registered interval so they can all be stopped at once,
 * e.g. when the game ends or the player returns to the home screen.
 */
export class IntervalHub {
    /**
     * Stores the IDs of all active intervals registered through this hub.
     * @type {number[]}
     */
    static allIntervals = [];

    /**
     * Starts a new interval and registers its ID for later cleanup.
     * @param {Function} func - The function to call on each interval tick.
     * @param {number} timer - The interval duration in milliseconds.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
    }

    /**
     * Stops all registered intervals and clears the tracking array.
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}
