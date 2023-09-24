/**
 * カレンダーの内容をドキュメントにエクスポートする
 * @param {GoogleAppsScript.Calendar[]} calendars - カレンダー選択UIで選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {string} カレンダーのデータを書き出したドキュメントファイルのURL
 */
function exportDocs(calendars, from, to) {
  const calendars = setCalendars(calendarIds);
  return getReportURL(calendars, from, to);
}

/**
 * カレンダーから指定された期間のイベントを取得し、レポートのドキュメントを作成する
 * @param {GoogleAppsScript.Calendar} calendars - 選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {GoogleAppsScript.Drive.File} 作成されたドキュメントのファイル
 */
function createReport(calendars, from, to) {
  const docName = `カレンダー・レポート_${from.getFullYear()}年${from.getMonth() + 1}月${from.getDate()}日〜${to.getMonth() + 1}月${to.getDate()}日`;
  // 新規Googleドキュメントを作成
  const doc = DocumentApp.create(docName);
  const body = doc.getBody();

  body.appendParagraph("カレンダー・レポート\n");
  body.appendParagraph(`期間: ${from.toLocaleDateString()} から ${to.toLocaleDateString()}\n\n`);

  const allEventsData = [];

  for (const calendar of calendars) {
      const events = calendar.getEvents(from, to);

      const eventData = events.map(event => {
          const startTime = event.getStartTime();

          // イベントが終日のものかどうかを確認
          let timeStr = "";
          if (!event.isAllDayEvent()) {
              timeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
          }

          return {
              date: startTime.toLocaleDateString(),
              time: timeStr,
              title: event.getTitle(),
              description: event.getDescription() || "",
          };
      });

      allEventsData.push(...eventData);
  }

  allEventsData.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

  let currentDate = "";
  let currentTableData = [["時刻", "内容", "詳細"]];
  for (const eventData of allEventsData) {
      if (currentDate !== eventData.date) {
          if (currentTableData.length > 1) {
              body.appendParagraph(currentDate);
              body.appendTable(currentTableData);
              body.appendParagraph("\n");
          }
          currentDate = eventData.date;
          currentTableData = [["時刻", "内容", "詳細"]];
      }
      currentTableData.push([eventData.time, eventData.title, eventData.description]);
  }
  if (currentTableData.length > 1) {
      body.appendParagraph(currentDate);
      body.appendTable(currentTableData);
  }

  return DriveApp.getFileById(doc.getId());
}

/**
 * レポートのドキュメントのURLを取得する
 * @param {GoogleAppsScript.Calendar} calendar - カレンダー選択UIで選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {string} レポートのドキュメントのURL
 */
function getReportURL(calendars, from, to) {
  const report = createReport(calendars, from, to);
  const movedReport = createReportInFolder(report);
  return movedReport.getUrl();
}

/**
 * レポートを指定のフォルダに保存する
 * @param {GoogleAppsScript.Drive.File} report - 移動するドキュメントのファイル
 * @returns {GoogleAppsScript.Drive.File} フォルダに移動されたドキュメントのファイル
 */
function createReportInFolder(report) {
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

function setCalendars(calendarIds) {
  const calendars = calendarIds.map(id => {
      const calendar = CalendarApp.getCalendarById(id);
      if (!calendar) {
          console.error(`カレンダーが見つかりません: ${id}`);
          return null;
      }
      return calendar;
  }).filter(calendar => calendar !== null);
  return calendars;
}

function onExportButtonClick() {
  const calendarIds = getDisplayedCalendars(); // Calendar.gsから呼び出し

  // 適切な開始日時と終了日時を設定
  const from = new Date(); // 例: 今日の日付
  from.setHours(0, 0, 0, 0);

  const to = new Date(); // 例: 明日の日付

  const reportUrl = exportDocs(calendarIds, from, to);
  // reportUrlをユーザーに通知するか、適切な処理を行う
  Browser.msgBox('Report URL:', reportUrl);
}

