
function onHomepageTrigger(event) {
    console.log(event);

    const card = CardService.newCardBuilder();

    const header = CardService.newCardHeader()
        .setTitle('カレンダーを選択して書き出す');

    const selectionInput = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setFieldName('selected_calendar_field')
        .setTitle('すべてのカレンダー');

    const calendars = getAllCalendars();
    console.log(calendars);
    for (const calendar of calendars) {
        selectionInput.addItem(calendar.name, calendar.id, false);
    }

    const section = CardService.newCardSection()
        .setHeader('カレンダーを選択する')
        .addWidget(selectionInput);

    const footer = CardService.newFixedFooter()
        .setPrimaryButton(CardService.newTextButton()
            .setText('Export')
            .setOnClickAction(CardService.newAction()
                .setLoadIndicator(CardService.LoadIndicator.SPINNER)
                .setFunctionName(onClickActionExport.name)
                .setParameters({})));

    card.setHeader(header);
    card.addSection(section);
    card.setFixedFooter(footer);

    return card.build();
}

function onClickActionExport(event) {
    console.log(event);

    const id = event.formInput['selected_calendar_field'];

    if (!id) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText('カレンダーが選択されていません'))
            .build();
    }

    const url = exportDocs(id);

    return CardService.newActionResponseBuilder()
        .setOpenLink(CardService.newOpenLink()
            .setUrl(url))
        .build();
}
