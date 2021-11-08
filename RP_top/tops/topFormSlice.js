import Fields from '../../util/formHelpers';

    const status = [
        {val: 'hidden', label: 'hidden'},
        {val: 'nomination', label: 'nomination'},
        {val: 'open', label: 'open'},
        {val: 'counting', label: 'counting'},
        {val: 'closed', label: 'closed'}
    ];
    const point = [
        {val: 'default', label: '(default) -3..5'},
        {val: 'limit', label: 'Лимит баллов'}
    ];
    const topFormConfig = {
        'path_id': Fields.path_id({
            title: "id"
        }, { model: "tops", key: "path_id" }),
        'name': Fields.i18n({
            title: "Название"
        }),
        'status': {
            'type': 'Select',
            'options': status
        },
        'point_type': {
            'type': 'Select',
            'options': point
        },
        'hide_places': {
            type: 'NumberWithInfinity',
            title: 'Сколько верхних скрывать',
            help: '∞ - скрывать все, 1 - не скрывать'
        },
        'point_limit': {
            'type': 'Number',
            title: 'Сколько баллов может потратить пользователь на голосование',
            'options': point
        },
        time: {
            type: 'Calendar', use_time: 1, time_value: "23:59",
            'title': 'Когда включить статус'
        },
        'date': {
            type: 'List',
            title: 'Даты топа',
            itemType: 'Object',
            subSchema: {
                status: {
                    'type': 'Select',
                    'options': status
                },
                time: {
                    type: 'Calendar', use_time: 1, time_value: "23:59",
                    'title': 'Когда включить статус'
                }
            }
        }
    }

export default topFormConfig;