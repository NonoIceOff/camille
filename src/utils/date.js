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
    showSeconds = true
) {
    const localeDigitsOptions = {
        minimumIntegerDigits: 2,
        useGrouping: false,
    };

    let seconds = Math.floor(date / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    return `${showDays && days > 0 ? days + ":" : ""}${
        showHours && hours > 0
            ? (showDays ? hours % 24 : hours).toLocaleString(
                  "en-US",
                  localeDigitsOptions
              ) + ":"
            : ""
    }${(showHours
        ? minutes % 60
        : showDays
        ? minutes % (60 * 24)
        : minutes
    ).toLocaleString("en-US", localeDigitsOptions)}${
        showSeconds
            ? ":" + (seconds % 60).toLocaleString("en-US", localeDigitsOptions)
            : ""
    }`;
}

module.exports = {
    toTimeFormat,
}
