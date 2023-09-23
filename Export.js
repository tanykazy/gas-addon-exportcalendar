function testApp(){
  // 複数のカレンダーをまとめて設定
  const calendars = setCalendars(calendarIds);
  console.log(calendars);

  exportDocs(calendars, startTime, endTime);

}

// テスト用データ
// 開始時, 終了時の指定
const startTime = new Date('2023/09/01 00:00:00');
const endTime = new Date('2023/10/01 00:00:00');
// 複数のカレンダーID
const calendarIds = [
    "c_classroom22b666db@group.calendar.google.com",
    "c_classroomeeb8affd@group.calendar.google.com",
    "c_classroomfc97e33f@group.calendar.google.com",
    "c_classroom55f0f8da@group.calendar.google.com"
];

//補助関数
function setCalendars(calendarIds) {
    // カレンダーIDの配列を元に、それぞれのカレンダーオブジェクトを取得し、配列にまとめて返す
    const calendars = calendarIds.map(id => CalendarApp.getCalendarById(id));
    return calendars;
}

function exportDocs(calendars, from, to) {
    console.log(calendars.map(calendar => calendar.getName()));
    console.log(from);
    console.log(to);

    return getReportURL(calendars, from, to);
}

function createReport(calendars, from, to) {
    // 新規Googleドキュメントを作成
    const doc = DocumentApp.create("カレンダーレポート_" + new Date().toISOString());
    const body = doc.getBody();
    
    body.appendParagraph(`カレンダーレポート \n期間: ${from ? from.toLocaleDateString() : "開始日未指定"} から ${to ? to.toLocaleDateString() : "終了日未指定"}\n`);

    for (const calendar of calendars) {
        // カレンダー名を追加
        body.appendParagraph(`カレンダー名: ${calendar.getName()}\n`);

        // カレンダーからイベントを取得
        const events = calendar.getEvents(from, to);
    
        const eventData = events.map(event => {
            return [event.getStartTime().toLocaleDateString(), event.getTitle(), event.getDescription() || ""];
        });

        // ヘッダー情報を追加
        const data = [["日時", "内容", "詳細"], ...eventData];

        body.appendTable(data);
    }

    return DriveApp.getFileById(doc.getId());
}

function getReportURL(calendar, from, to) {
  const report = createReport(calendar, from, to);
  const movedReport = createReportInFolder(report);
  return movedReport.getUrl();
}


function createReportInFolder(report) { // 引数を追加
  const folderName = "calendarReport";
  let folder;
  
  // フォルダの存在確認および作成
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }

  // ドキュメントをフォルダに移動
  report.moveTo(folder);

  return report;
}