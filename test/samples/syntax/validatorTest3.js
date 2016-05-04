var validator = require('../../../validator.js');
var input = [
    [
        {
            'permissionDef': {
                'txname': '$txname',
                'permissions': {
                    'groups': [
                        'admin',
                        '$txnGroup',
                        '$regionGroup'
                    ]
                }
            }
        },
        {
            'defaultGroup': '$defaultGroup'
        },
        {
            'appType': '$appType'
        },
        {
            '$or': [
                {
                    'usettings': {
                        'application': '$appType',
                        'scope': 'business',
                        'setting_type': 'txn',
                        'name': '$txname',
                        'value': '$txnGroup'
                    }
                },
                {
                    '$bind': [
                        '$defaultGroup',
                        '$txnGroup'
                    ]
                }
            ]
        },
        {
            '$or': [
                {
                    '$and': [
                        {
                            'usettings': {
                                'application': '$appType',
                                'scope': 'business',
                                'setting_type': 'txnrule',
                                'name': '$txname',
                                'value': 'accessByRegion'
                            }
                        },
                        {
                            'row': {
                                'attributes': {
                                    'sales_region': '$regionGroup'
                                }
                            }
                        }
                    ]
                },
                {
                    '$bind': [
                        '$regionGroup',
                        null
                    ]
                }
            ]
        }
    ],
    [
        {
            'cpPermissionDef': {
                'txname': '$txname',
                'permissions': {
                    'groups': [
                        'admin',
                        '$txnGroup',
                        '$regionGroup'
                    ]
                }
            }
        },
        {
            'defaultGroup': '$defaultGroup'
        },
        {
            'appType': '$appType'
        },
        {
            '$or': [
                {
                    'usettings': {
                        'application': '$appType',
                        'scope': 'business',
                        'setting_type': 'txn',
                        'name': '$txname',
                        'value': '$txnGroup'
                    }
                },
                {
                    '$bind': [
                        '$defaultGroup',
                        '$txnGroup'
                    ]
                }
            ]
        },
        {
            '$or': [
                {
                    '$and': [
                        {
                            'usettings': {
                                'application': '$appType',
                                'scope': 'business',
                                'setting_type': 'txnrule',
                                'name': '$txname',
                                'value': 'accessByRegion'
                            }
                        },
                        {
                            'row': {
                                'attributes': {
                                    'sales_region': '$regionGroup'
                                }
                            }
                        }
                    ]
                },
                {
                    '$bind': [
                        '$regionGroup',
                        null
                    ]
                }
            ]
        }
    ],
    [
        {
            'saralwebOnlyPermissionDef': {
                'txname': '$txname',
                'permissions': {
                    'businessId': 1098363,
                    'groups': [
                        'admin',
                        '$txnGroup',
                        '$regionGroup'
                    ]
                }
            }
        },
        {
            'defaultGroup': '$defaultGroup'
        },
        {
            'appType': '$appType'
        },
        {
            '$or': [
                {
                    'usettings': {
                        'application': '$appType',
                        'scope': 'business',
                        'setting_type': 'txn',
                        'name': '$txname',
                        'value': '$txnGroup'
                    }
                },
                {
                    '$bind': [
                        '$defaultGroup',
                        '$txnGroup'
                    ]
                }
            ]
        },
        {
            '$or': [
                {
                    '$and': [
                        {
                            'usettings': {
                                'application': '$appType',
                                'scope': 'business',
                                'setting_type': 'txnrule',
                                'name': '$txname',
                                'value': 'accessByRegion'
                            }
                        },
                        {
                            'row': {
                                'attributes': {
                                    'sales_region': '$regionGroup'
                                }
                            }
                        }
                    ]
                },
                {
                    '$bind': [
                        '$regionGroup',
                        null
                    ]
                }
            ]
        }
    ],
    [
        {
            'operatorOnlyPermissionDef': {
                'permissions': {
                    'userId': 4
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'reminder',
                'config': {
                    'txnDisplayName': 'Set Reminder'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'remind',
                'config': {
                    'txnDisplayName': 'Remind'
                }
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'create',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'row': {
                'status': 'start'
            }
        },
        {
            'permissionDef': {
                'txname': 'create',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'sendMessage',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            '$not': [
                {
                    'cpRow': {
                        'status': 'xinvited'
                    }
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'sendMessage',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'sendMessageAndAccept',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'cpRow': {
                'status': 'xinvited'
            }
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'sendMessage',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'sendLeadResponse',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'appType': 'sales'
        },
        {
            '$or': [
                {
                    'cpRow': {
                        'status': 'xaccepted'
                    }
                },
                {
                    'cpRow': {
                        'status': 'accepted'
                    }
                }
            ]
        },
        {
            'row': {
                'status': 'qualified',
                'is_principal': true
            }
        },
        {
            'row': {
                'attributes': {
                    'product_id': '$productId'
                }
            }
        },
        {
            '$call': [
                'notNull',
                '$productId'
            ]
        },
        {
            'permissionDef': {
                'txname': 'sendMessage',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'welcomeToSaralweb',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'appType': 'sales'
        },
        {
            'row': {
                'business_id': 1098363
            }
        },
        {
            '$or': [
                {
                    'cpRow': {
                        'status': 'xaccepted'
                    }
                },
                {
                    'cpRow': {
                        'status': 'accepted'
                    }
                }
            ]
        },
        {
            'row': {
                'status': 'qualified',
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'sendMessage',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'postComment',
                'envDeps': {
                    'permissions': {}
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpCreate',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'row': {
                'status': 'start'
            }
        },
        {
            'permissionDef': {
                'txname': 'cpCreate',
                'permissions': '$permissions1'
            }
        },
        {
            '$call': [
                'extend',
                '$permissions1',
                {
                    'blocked': false
                },
                [
                    '$permissions'
                ]
            ]
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpSendMessage',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    'cpRow': {
                        'status': 'xinvited'
                    }
                }
            ]
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': false
            }
        },
        {
            'cpPermissionDef': {
                'txname': 'cpSendMessage',
                'permissions': '$permissions1'
            }
        },
        {
            '$call': [
                'extend',
                '$permissions1',
                {
                    'blocked': false
                },
                [
                    '$permissions'
                ]
            ]
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpSendMessageAndAccept',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'cpRpw': {
                'status': 'xinvited'
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': false
            }
        },
        {
            'cpPermissionDef': {
                'txname': 'cpSendMessage',
                'permissions': '$permissions1'
            }
        },
        {
            '$call': [
                'extend',
                '$permissions1',
                {
                    'blocked': false
                },
                [
                    '$permissions'
                ]
            ]
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpPostComment',
                'envDeps': {
                    'permissions': {}
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': false
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'reminder',
                'envDeps': {
                    'permissions': {
                        'contactId': '$contactId',
                        'groups': [
                            'admin'
                        ]
                    }
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'reminder'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': true,
                'assigned_to': '$contactId'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'remind',
                'envDeps': {
                    'permissions': {
                        'userId': 4
                    }
                }
            }
        },
        {
            'row': {
                'status': 'reminder'
            }
        }
    ],
    [
        {
            'appType': 'sales'
        }
    ],
    [
        {
            'serviceName': 'qmxSalesService'
        }
    ],
    [
        {
            'defaultGroup': 'sales'
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'create',
                'config': {
                    'txnDisplayName': 'Create',
                    'txnPermissionLabel': 'New Sales Prospect'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'edit',
                'config': {
                    'txnDisplayName': 'Edit',
                    'txnPermissionLabel': 'Edit Sales Prospect'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'sendMessage',
                'config': {
                    'txnPermissionLabel': 'Send Message in Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'sendMessageAndAccept',
                'config': {}
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'sendLeadResponse',
                'config': {
                    'txnDisplayName': 'Create',
                    'txnPermissionLabel': 'Respond to a Sales Lead'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'welcomeToSaralweb',
                'config': {}
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'postComment',
                'config': {
                    'txnPermissionLabel': 'Post  Comments in Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'qualify',
                'config': {
                    'txnDisplayName': 'Qualify',
                    'txnPermissionLabel': 'Qualify Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'engage',
                'config': {
                    'txnDisplayName': 'Engage',
                    'txnPermissionLabel': 'Engage Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'cold',
                'config': {
                    'txnDisplayName': 'Cold',
                    'txnPermissionLabel': 'Mark Sales Conversation Cold'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'revive',
                'config': {
                    'txnDisplayName': 'Revive',
                    'txnPermissionLabel': 'Revive a Cold Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'close',
                'config': {
                    'txnDisplayName': 'Close',
                    'txnPermissionLabel': 'Close Sale'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'view',
                'config': {
                    'txnDisplayName': 'View',
                    'txnPermissionLabel': 'View Sales Conversation'
                }
            }
        }
    ],
    [
        {
            'txnConfig': {
                'txname': 'contactDetails',
                'config': {
                    'txnDisplayName': 'Contact Details'
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpManageSalesLeadFilters',
                'config': {
                    'txnDisplayName': 'Manage Sales Lead Filters',
                    'txnPermissionLabel': ''
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpCreate',
                'config': {
                    'txnDisplayName': '',
                    'txnPermissionLabel': 'Make New Sales Inquiries'
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpSendMessage',
                'config': {
                    'txnDisplayName': 'Send Messages in Sales Inquiries',
                    'txnPermissionLabel': ''
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpSendMessageAndAccept',
                'config': {
                    'txnDisplayName': '',
                    'txnPermissionLabel': ''
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpPostComment',
                'config': {
                    'txnDisplayName': 'Post Comments in Sales Inquiries',
                    'txnPermissionLabel': ''
                }
            }
        }
    ],
    [
        {
            'cpTxnConfig': {
                'txname': 'cpContactDetails',
                'config': {
                    'txnDisplayName': 'Contact Details',
                    'txnPermissionLabel': ''
                }
            }
        }
    ],
    [
        {
            'availableTxns': {
                'txname': '$txname',
                'envDeps': '$envDeps'
            }
        },
        {
            'atxn': {
                'txname': '$txname',
                'envDeps': '$envDeps'
            }
        },
        {
            'txnConfig': {
                'txname': '$txname'
            }
        }
    ],
    [
        {
            'availableCpTxns': {
                'txname': '$txname',
                'envDeps': '$envDeps'
            }
        },
        {
            'atxn': {
                'txname': '$txname',
                'envDeps': '$envDeps'
            }
        },
        {
            'cpTxnConfig': {
                'txname': '$txname'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'edit',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$or': [
                {
                    'row': {
                        'status': 'new'
                    }
                },
                {
                    'row': {
                        'status': 'qualified'
                    }
                },
                {
                    'row': {
                        'status': 'engaged'
                    }
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'edit',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'qualify',
                'envDeps': {
                    'permissions': '$permissions'
                },
                'random': 'stuff'
            }
        },
        {
            'row': {
                'status': 'new',
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'qualify',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'engage',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'row': {
                'status': 'qualified',
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'engage',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cold',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$or': [
                {
                    'row': {
                        'status': 'new'
                    }
                },
                {
                    'row': {
                        'status': 'qualified'
                    }
                },
                {
                    'row': {
                        'status': 'engaged'
                    }
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'cold',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'revive',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'row': {
                'status': 'cold',
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'revive',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'close',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    '$or': [
                        {
                            'row': {
                                'status': 'start'
                            }
                        },
                        {
                            'row': {
                                'status': 'closed'
                            }
                        }
                    ]
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'close',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'view',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    'row': {
                        'status': 'start'
                    }
                }
            ]
        },
        {
            'row': {
                'is_principal': true
            }
        },
        {
            'permissionDef': {
                'txname': 'view',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpManageSalesLeadFilters',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            'row': {
                'status': 'start'
            }
        },
        {
            'saralwebOnlyPermissionDef': {
                'txname': 'cpManageSalesFilters',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'contactDetails',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    'row': {
                        'status': 'start'
                    }
                }
            ]
        },
        {
            'permissionDef': {
                'txname': 'contactDetails',
                'permissions': '$permissions'
            }
        }
    ],
    [
        {
            'atxn': {
                'txname': 'cpContactDetails',
                'envDeps': {
                    'permissions': '$permissions'
                }
            }
        },
        {
            '$not': [
                {
                    'row': {
                        'status': 'start'
                    }
                }
            ]
        },
        {
            'cpPermissionDef': {
                'txname': 'cpContactDetails',
                'permissions': '$permissions'
            }
        }
    ]
]

//console.log(JSON.stringify(validator.validateJsl(input), null, 2));
module.exports = validator.validateJsl(input);
