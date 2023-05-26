export default {
    slotsCfg: ['opt'],
    colsCfg: [
        { type: 'checkbox', field: 'checkbox', width: 44, align: 'center' },
        {
            field: 'ident',
            title: '编号',
            minWidth: 150,
            field_disabled: true,
            width: '10%',
            sortable: true,
            resizable: true
        },
        {
            field: 'name',
            title: '预案名称',
            field_disabled: true,
            minWidth: 200,
            sortable: true
        },
        {
            field: 'server_node_name',
            title: '节点',
            minWidth: 200,
            width: '15%',
            sortable: true
        },
        {
            field: 'rto_result',
            title: 'RTO达标',
            minWidth: 150,
            align: 'center',
            width: '10%',
            sortable: true
        },
        {
            field: 'controlled_stage',
            title: '受控状态',
            minWidth: 150,
            align: 'center',
            width: '10%',
            sortable: true
        },
        {
            field: 'last_update_datetime',
            title: '最后更新时间',
            minWidth: 200,
            width: '15%',
            align: 'center',
            sortable: true
        },
        {
            field: 'opt',
            title: '操作',
            width: 150,
            sortable: false,
            resizable: false,
            field_disabled: true,
            align: 'center',
            slots: {
                default: 'opt'
            }
        }
    ]
}