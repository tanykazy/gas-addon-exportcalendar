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
    const visibleCalendarIds = calendars.filter(calendar => !calendar.isHidden() && calendar.isSelected()).map(calendar => calendar.getId());
    console.log(visibleCalendarIds);
    
    return visibleCalendarIds;
}

function sortCalendar(calendars) {
    const primary = [];
    const selected = [];
    const owned = [];
    const hidden = [];
    const other = [];
    for (const calendar of calendars) {
        if (calendar.isMyPrimaryCalendar()) {
            primary.push(calendar);
        } else if (calendar.isSelected()) {
            selected.push(calendar);
        } else if (calendar.isOwnedByMe()) {
            owned.push(calendar);
        } else if (calendar.isHidden()) {
            hidden.push(calendar);
        } else {
            other.push(calendar);
        }
    }
    return [...primary, ...selected, ...owned, ...other, ...hidden];
}