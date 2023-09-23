function onHomepageTrigger(event) {
    console.log(event);
  
    const numOfDropdowns = event.parameters ? event.parameters.numOfDropdowns || 1 : 1;
  
    const card = CardService.newCardBuilder();
    const header = CardService.newCardHeader().setTitle('カレンダーを選択して書き出す');
    card.setHeader(header);
  
    for (let i = 0; i < numOfDropdowns; i++) {
        const selectionInput = createCalendarDropdown(i);
        const sectionSelectCalendar = CardService.newCardSection().addWidget(selectionInput);
        card.addSection(sectionSelectCalendar);
    }
  
    const addButton = CardService.newTextButton()
        .setText('+')
        .setOnClickAction(CardService.newAction()
            .setFunctionName('onAddDropdown')
            .setParameters({numOfDropdowns: (parseInt(numOfDropdowns) + 1).toString()}));
    const sectionAddButton = CardService.newCardSection().addWidget(addButton);
  
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

    card.addSection(sectionAddButton);
    card.addSection(sectionDatePick);
    card.setFixedFooter(footer);

    return card.build();
}
 
function createCalendarDropdown(index) {
    const calendars = getAllCalendars();
    const selectionInput = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setFieldName(`selected_calendar_field_${index}`)
        .setTitle(`カレンダー ${index + 1}`);
    for (const calendar of calendars) {
        selectionInput.addItem(calendar.name, calendar.id, false);
    }
    return selectionInput;
}
  
function onAddDropdown(event) {
    return onHomepageTrigger(event);
}

function getSelectedCalendars(event) {
    // eventオブジェクトから選択されたカレンダーのIDを取得
    const selectedCalendarIds = event.formInput.selected_calendar_field;
    
    // 選択されたカレンダーの情報を取得
    const selectedCalendars = selectedCalendarIds.map(id => {
        const calendar = CalendarApp.getCalendarById(id);
        return {
            name: calendar.getName(),
            id: calendar.getId()
        };
    });
    
    return selectedCalendars;
}

function onClickActionExport(event) {
    console.log(event);

    const selectedCalendarIds = [];
    let index = 0;
    while (true) {
        const id = event.formInput[`selected_calendar_field_${index}`];
        if (!id) break;
        selectedCalendarIds.push(id);
        index++;
    }

    if (selectedCalendarIds.length === 0) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText('カレンダーが選択されていません'))
            .build();
    }

    const from = event.formInput['from_date_field'] ? new Date(event.formInput['from_date_field'].msSinceEpoch) : null;
    const to = event.formInput['to_date_field'] ? new Date(event.formInput['to_date_field'].msSinceEpoch) : null;

    url = exportDocs(selectedCalendarIds, from, to);

    return CardService.newActionResponseBuilder()
        .setOpenLink(CardService.newOpenLink()
            .setUrl(url))
        .build();
}
