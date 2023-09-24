/**
 * カレンダーコンテキストのホームページトリガー
 * @param {Object} event - イベントオブジェクト
 * @returns {GoogleAppsScript.Card_Service.Card} ホームカード
 */
function onHomepageTrigger(event) {
    const card = CardService.newCardBuilder();

    const header = CardService.newCardHeader()
        .setTitle('期間を選択して書き出す');

    const now = new Date();

    const fromDatePicker = CardService.newDatePicker()
        .setFieldName('from_date_field')
        .setTitle('From')
        .setValueInMsSinceEpoch(now.setDate(1));

    const toDatePicker = CardService.newDatePicker()
        .setFieldName('to_date_field')
        .setTitle('To')
        .setValueInMsSinceEpoch(now.setMonth(now.getMonth() + 1, 0));

    const sectionDatePick = CardService.newCardSection()
        .setHeader('期間を選択する')
        .addWidget(fromDatePicker)
        .addWidget(toDatePicker);

    const footer = CardService.newFixedFooter()
        .setPrimaryButton(CardService.newTextButton()
            .setText('Export')
            .setOnClickAction(CardService.newAction()
                .setLoadIndicator(CardService.LoadIndicator.SPINNER)
                .setFunctionName(onClickActionExport.name)
                .setParameters({})));

    card.setHeader(header);
    card.addSection(sectionDatePick);
    card.setFixedFooter(footer);

    return card.build();
}

/**
 * エクスポート関数を呼び出すイベントハンドラ
 * @param {Object} event - イベントオブジェクト
 * @returns {GoogleAppsScript.Card_Service.ActionResponse} アクションレスポンス
 */
function onClickActionExport(event) {
    const calendars = getDisplayedCalendars();

    if (!calendars.length) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText('カレンダーが選択されていません'))
            .build();
    }

    const from = event.formInput['from_date_field'];
    const to = event.formInput['to_date_field'];

    if (!from || !to) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText('期間が選択されていません'))
            .build();
    }

    const url = exportDocs(calendars, new Date(from.msSinceEpoch), new Date(to.msSinceEpoch));

    return CardService.newActionResponseBuilder()
        .setOpenLink(CardService.newOpenLink()
            .setUrl(url))
        .build();
}
