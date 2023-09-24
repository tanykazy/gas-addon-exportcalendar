function onHomepageTrigger(event) {
    console.log(event);

    const card = CardService.newCardBuilder();

    const header = CardService.newCardHeader()
        .setTitle('期間を選択して書き出す');

    // const selectionInput = CardService.newSelectionInput() .setType(CardService.SelectionInputType.DROPDOWN)
    //     .setFieldName('selected_calendar_field')
    //     .setTitle('すべてのカレンダー');

    // const calendars = getAllCalendars();
    // console.log(calendars);
    // for (const calendar of calendars) {
    //     selectionInput.addItem(calendar.name, calendar.id, false);
    // }

    // const sectionSelectCalendar = CardService.newCardSection()
    //     .setHeader('カレンダーを選択する')
    //     .addWidget(selectionInput);

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
    // card.addSection(sectionSelectCalendar);
    card.addSection(sectionDatePick);
    card.setFixedFooter(footer);

    return card.build();
}

function onClickActionExport(event) {
    console.log(event);

    // const id = event.formInput['selected_calendar_field'];

    // if (!id) {
    //     return CardService.newActionResponseBuilder()
    //         .setNotification(CardService.newNotification()
    //             .setText('カレンダーが選択されていません'))
    //         .build();
    // }

    const from = event.formInput['from_date_field'] ? new Date(event.formInput['from_date_field'].msSinceEpoch) : null;
    const to = event.formInput['to_date_field'] ? new Date(event.formInput['to_date_field'].msSinceEpoch) : null;

    // const calendar = CalendarApp.getCalendarById(id);
    const calendars = getDisplayedCalendars();

    const url = exportDocs(calendars, from, to);

    return CardService.newActionResponseBuilder()
        .setOpenLink(CardService.newOpenLink()
            .setUrl(url))
        .build();
}
