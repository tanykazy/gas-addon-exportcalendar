function onHomepageTrigger(event) {
    console.log(event);

    const card = CardService.newCardBuilder();
    const header = CardService.newCardHeader().setTitle('期間を選択してください');
    card.setHeader(header);

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
            .setText('日誌レポートを生成する')
            .setOnClickAction(CardService.newAction()
                .setLoadIndicator(CardService.LoadIndicator.SPINNER)
                .setFunctionName('onClickActionExport')));

    card.addSection(sectionDatePick);
    card.setFixedFooter(footer);

    return card.build();
}

function onClickActionExport(event) {
    console.log(event);

    const selectedCalendarIds = getDisplayedCalendars();

    const from = event.formInput['from_date_field'] ? new Date(event.formInput['from_date_field'].msSinceEpoch) : null;
    const to = event.formInput['to_date_field'] ? new Date(event.formInput['to_date_field'].msSinceEpoch) : null;

    url = exportDocs(selectedCalendarIds, from, to);

    return CardService.newActionResponseBuilder()
        .setOpenLink(CardService.newOpenLink()
            .setUrl(url))
        .build();
}