/**
 *
 * @param {Date} date
 * @param {boolean} showDays
 * @param {boolean} showHours
 * @param {boolean} showSeconds
 * @returns {string}
 */
function toTimeFormat(
    date,
    showDays = false,
    showHours = true,
    showSeconds = true,
    showUnits = false
) {
    const localeDigitsOptions = {
        minimumIntegerDigits: showUnits ? 1 : 2,
        useGrouping: false,
    };

    let seconds = Math.floor(date / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    return `${showDays && days > 0 ? days + (showUnits ? "j " : ":") : ""}${
        showHours && hours > 0
            ? (showDays ? hours % 24 : hours).toLocaleString(
                  "en-US",
                  localeDigitsOptions
              ) + (showUnits ? "h " : ":")
            : ""
    }${
        (showHours
            ? minutes % 60
            : showDays
            ? minutes % (60 * 24)
            : minutes
        ).toLocaleString("en-US", localeDigitsOptions) + (showUnits ? "m " : "")
    }${
        showSeconds
            ? (showUnits ? "" : ":") +
              (seconds % 60).toLocaleString("en-US", localeDigitsOptions) +
              (showUnits ? "s" : "")
            : ""
    }`;
}

function runAtDate(date, func) {
    var now = Date.now()
    var diff = Math.max((date - now), 0);
    if (diff > 0x7FFFFFFF) //setTimeout limit is MAX_INT32=(2^31-1)
        setTimeout(function() {runAtDate(date, func);}, 0x7FFFFFFF);
    else
        setTimeout(func, diff);
}

module.exports = {
    toTimeFormat,
    runAtDate,
};
