/**
 * @typedef {object} CalendarParam - カレンダーの名前とID
 * @property {string} name - カレンダーの名前
 * @property {string} id - カレンダーのID
 */

/**
 * ユーザーがオーナーまたは登録しているすべてのカレンダーを取得する
 * @returns {CalendarParam[]} カレンダーの名前とIDの配列
 */
function getAllCalendars() {
    const calendars = CalendarApp.getAllCalendars();

    return calendars.map((calendar) => {
        return {
            name: calendar.getName(),
            id: calendar.getId()
        };
    });
}

/**
 * 表示され選択されているカレンダーを取得する
 * @returns {GoogleAppsScript.Calendar.Calendar[]} カレンダーの配列
 */
function getDisplayedCalendars() {
    const calendars = CalendarApp.getAllCalendars();

    return calendars.filter((calendar) => {
        if (calendar.isHidden()) {
            return false;
        }
        if (calendar.isSelected()) {
            return true;
        }
        return false;
    });
}
