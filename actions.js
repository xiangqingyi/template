module.exports = [
    {
        name: '角色管理',
        actions: [
            {
                name: '角色訪問',
                value: 'ROLE_INDEX',
                description: '角色訪問'
            },{
                name: '創建角色',
                value: 'ROLE_CREATE',
                description: '創建角色'
            },{
                name: '查看角色信息',
                value: 'ROLE_DETAIL',
                description: '查看角色信息'
            },{
                name: '編輯角色',
                value: 'ROLE_UPDATE',
                description: '編輯角色'
            },{
                name: '刪除角色',
                value: 'ROLE_DELETE',
                description: '刪除角色'
            }
        ]
    },{
        name: '用戶管理',
        actions: [
            {
                name: '用戶訪問',
                value: 'USER_INDEX',
                description: '用戶訪問'
            },{
                name: '創建用戶',
                value: 'USER_CREATE',
                description: '創建用戶'
            },{
                name: '查看用戶信息',
                value: 'USER_DETAIL',
                description: '查看用戶信息'
            },{
                name: '編輯用戶',
                value: 'USER_UPDATE',
                description: '編輯用戶'
            },{
                name: '刪除用戶',
                value: 'USER_DELETE',
                description: '刪除用戶'
            }
        ]
    },{
        name: '日誌管理',
        actions: [
            {
                name: '日誌訪問',
                value: 'LOG_INDEX',
                description: '日誌訪問'
            },{
                name: '查看日誌信息',
                value: 'LOG_DETAIL',
                description: '查看日誌信息'
            },{
                name: '刪除日誌',
                value: 'LOG_DELETE',
                description: '刪除日誌'
            }
        ]
    }
];



