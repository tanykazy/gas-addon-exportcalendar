function exportDocs(calendarIds, from, to) {
    const calendars = setCalendars(calendarIds);
    console.log(from);
    console.log(to);
    return getReportURL(calendars, from, to);
}

function createReport(calendars, from, to) {
    // 作成するドキュメントの名前を、生成する期間を反映して指定
    const docName = `カレンダー・レポート_${from.getFullYear()}年${from.getMonth() + 1}月${from.getDate()}日〜${to.getMonth() + 1}月${to.getDate()}日`;
    const doc = DocumentApp.create(docName);
    const body = doc.getBody();
    
    // カレンダー名を取得し、カンマで結合
    const calendarNames = calendars.map(calendar => calendar.getName()).join(" , ");
    
    // レポートの冒頭を指定の書式に変更
    body.appendParagraph("カレンダー・レポート\n");
    body.appendParagraph(`カレンダー名 : ${calendarNames}\n`);
    body.appendParagraph(`期間: ${from.toLocaleDateString()} から ${to.toLocaleDateString()}\n\n`);
    
    // 全てのカレンダーからのイベントを保持する配列
    const allEventsData = [];

    for (const calendar of calendars) {
        const events = calendar.getEvents(from, to);
    
        const eventData = events.map(event => {
            const startTime = event.getStartTime();
            const endTime = event.getEndTime();
            return {
                date: startTime.toLocaleDateString(),
                time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
                title: event.getTitle(),
                description: event.getDescription() || "",
            };
        });

        allEventsData.push(...eventData);
    }

    // 日付と時刻でソート
    allEventsData.sort((a, b) => new Date(a.date + ' ' + a.time.split(' - ')[0]) - new Date(b.date + ' ' + b.time.split(' - ')[0]));
    
    // 各日付ごとに表を作成
    let currentDate = "";
    let currentTableData = [["時刻", "内容", "詳細"]];
    for (const eventData of allEventsData) {
        if (currentDate !== eventData.date) {
            // 新しい日付の場合、これまでの表を追加して新しい表を開始
            if (currentTableData.length > 1) {
                body.appendParagraph(currentDate);
                body.appendTable(currentTableData);
                body.appendParagraph("\n"); // 空行を追加
            }
            currentDate = eventData.date;
            currentTableData = [["時刻", "内容", "詳細"]];
        }
        currentTableData.push([eventData.time, eventData.title, eventData.description]);
    }
    // 最後の表を追加
    if (currentTableData.length > 1) {
        body.appendParagraph(currentDate);
        body.appendTable(currentTableData);
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

function setCalendars(calendarIds) {
    const calendars = calendarIds.map(id => {
        const calendar = CalendarApp.getCalendarById(id);
        if (!calendar) {
            console.error(`カレンダーが見つかりません: ${id}`);
            return null;
        }
        return calendar;
    }).filter(calendar => calendar !== null); // nullのカレンダーをフィルタリング
    return calendars;
}
