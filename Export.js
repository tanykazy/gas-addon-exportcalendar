function exportDocs(calendarIds, from, to) {
    const calendars = setCalendars(calendarIds);
    console.log(from);
    console.log(to);
    return getReportURL(calendars, from, to);
}

function setCalendars(calendarIds) {
    const calendars = calendarIds.map(id => CalendarApp.getCalendarById(id));
    return calendars;
}

function createReport(calendars, from, to) {
    const doc = DocumentApp.create("カレンダーレポート_" + new Date().toISOString());
    const body = doc.getBody();
    
    body.appendParagraph(`カレンダーレポート \n期間: ${from ? from.toLocaleDateString() : "開始日未指定"} から ${to ? to.toLocaleDateString() : "終了日未指定"}\n`);
  
    for (const calendar of calendars) {
        if (!calendar.getName) {
            console.error(`Invalid calendar object: ${JSON.stringify(calendar)}`);
            continue;
        }

        body.appendParagraph(`カレンダー名: ${calendar.getName()}\n`);
        const events = calendar.getEvents(from, to);
    
        const eventData = events.map(event => {
            return [event.getStartTime().toLocaleDateString(), event.getTitle(), event.getDescription() || ""];
        });

        const data = [["日時", "内容", "詳細"], ...eventData];
        body.appendTable(data);
    }

    return DriveApp.getFileById(doc.getId());
}

function getReportURL(calendars, from, to) {
    const report = createReport(calendars, from, to);
    const movedReport = createReportInFolder(report);
    return movedReport.getUrl();
}

function createReportInFolder(report) {
    const folderName = "calendarReport";
    let folder;
  
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
        folder = folders.next();
    } else {
        folder = DriveApp.createFolder(folderName);
    }

    report.moveTo(folder);
    return report;
}
