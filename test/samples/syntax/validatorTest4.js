var validator = require('../../../validator.js');
var input = [
  [
    {
      'doctype': {
        'sales': [
          {
            'id': 'y',
            'label': 'Report Type',
            'type': 'select',
            'data': [
              {
                'text': 'Cumulative',
                'value': 'cumulative'
              },
              {
                'text': 'Rate',
                'value': 'rate'
              },
              {
                'text': 'Change of Rate',
                'value': 'deltaRate'
              }
            ]
          },
          {
            'id': 'form',
            'label': 'Report Form',
            'type': 'select',
            'data': [
              {
                'text': 'Graphical',
                'value': 'graph'
              },
              {
                'text': 'Tabular',
                'value': 'table'
              }
            ]
          },
          {
            'id': 'type',
            'label': 'Graph Type',
            'type': 'select',
            'data': [
              {
                'text': 'Lines',
                'value': 'line'
              },
              {
                'text': 'Areas',
                'value': 'area'
              },
              {
                'text': 'Bars',
                'value': 'column'
              }
            ]
          },
          {
            'id': 'stacked',
            'label': 'Stacked Graph',
            'type': 'switch'
          },
          {
            'id': 'numeric',
            'label': 'Report On',
            'type': 'checkboxgroup',
            'data': [
              {
                'text': 'No. of Transactions',
                'value': 'txnUnits'
              }
            ]
          },
          {
            'id': 'enum1',
            'label': '$labelEnum1',
            'type': 'propertysheet-radio',
            'data': [
              {
                'id': 'teamMembers',
                'readonly': '$enum1TeamMembersReadOnly',
                'label': 'Team Members',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.teamMembers',
                    'label': 'Team Members',
                    'type': 'checkboxgroup',
                    'data': []
                  }
                ]
              },
              {
                'id': 'conversationStatus',
                'readonly': false,
                'label': 'Conversation Status',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.conversationStatus',
                    'label': 'Conversation Status',
                    'type': 'checkboxgroup',
                    'data': [
                      {
                        'text': 'New',
                        'value': 'new'
                      },
                      {
                        'text': 'Qualified',
                        'value': 'qualified'
                      },
                      {
                        'text': 'Engaged',
                        'value': 'engaged'
                      },
                      {
                        'text': 'Cold',
                        'value': 'cold'
                      },
                      {
                        'text': 'Closed',
                        'value': 'closed'
                      }
                    ]
                  }
                ]
              }
            ],
            'readonly': false
          },
          {
            'id': 'enum2',
            'label': '$labelEnum2',
            'type': 'select',
            'data': [
              {
                'text': 'Team Members',
                'value': 'teamMembers'
              },
              {
                'text': 'Conversation Status',
                'value': 'conversationStatus'
              }
            ]
          },
          {
            'id': 'enum2Selected',
            'type': 'hidden'
          },
          {
            'id': 'range',
            'type': 'hidden'
          }
        ],
        'leads': [
          {
            'id': 'y',
            'label': 'Report Type',
            'type': 'select',
            'data': [
              {
                'text': 'Cumulative',
                'value': 'cumulative'
              },
              {
                'text': 'Rate',
                'value': 'rate'
              },
              {
                'text': 'Change of Rate',
                'value': 'deltaRate'
              }
            ]
          },
          {
            'id': 'form',
            'label': 'Report Form',
            'type': 'select',
            'data': [
              {
                'text': 'Graphical',
                'value': 'graph'
              },
              {
                'text': 'Tabular',
                'value': 'table'
              }
            ]
          },
          {
            'id': 'type',
            'label': 'Graph Type',
            'type': 'select',
            'data': [
              {
                'text': 'Lines',
                'value': 'line'
              },
              {
                'text': 'Areas',
                'value': 'area'
              },
              {
                'text': 'Bars',
                'value': 'column'
              }
            ]
          },
          {
            'id': 'stacked',
            'label': 'Stacked Graph',
            'type': 'switch'
          },
          {
            'id': 'numeric',
            'label': 'Report On',
            'type': 'checkboxgroup',
            'data': [
              {
                'text': 'No. of Transactions',
                'value': 'txnUnits'
              }
            ]
          },
          {
            'id': 'enum1',
            'label': '$labelEnum1',
            'type': 'propertysheet-radio',
            'data': [
              {
                'id': 'teamMembers',
                'readonly': '$enum1TeamMembersReadOnly',
                'label': 'Team Members',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.teamMembers',
                    'label': 'Team Members',
                    'type': 'checkboxgroup',
                    'data': []
                  }
                ]
              },
              {
                'id': 'conversationStatus',
                'readonly': false,
                'label': 'Conversation Status',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.conversationStatus',
                    'label': 'Conversation Status',
                    'type': 'checkboxgroup',
                    'data': [
                      {
                        'text': 'New',
                        'value': 'new'
                      },
                      {
                        'text': 'Qualified',
                        'value': 'qualified'
                      },
                      {
                        'text': 'Approved',
                        'value': 'approved'
                      },
                      {
                        'text': 'FollowUp',
                        'value': 'followup'
                      },
                      {
                        'text': 'Response',
                        'value': 'response'
                      },
                      {
                        'text': 'Rejected',
                        'value': 'rejected'
                      },
                      {
                        'text': 'Closed',
                        'value': 'closed'
                      }
                    ]
                  }
                ]
              }
            ],
            'readonly': false
          },
          {
            'id': 'enum2',
            'label': '$labelEnum2',
            'type': 'select',
            'data': [
              {
                'text': 'Team Members',
                'value': 'teamMembers'
              },
              {
                'text': 'Conversation Status',
                'value': 'conversationStatus'
              }
            ]
          },
          {
            'id': 'enum2Selected',
            'type': 'hidden'
          },
          {
            'id': 'range',
            'type': 'hidden'
          }
        ],
        'support': [
          {
            'id': 'y',
            'label': 'Report Type',
            'type': 'select',
            'data': [
              {
                'text': 'Cumulative',
                'value': 'cumulative'
              },
              {
                'text': 'Rate',
                'value': 'rate'
              },
              {
                'text': 'Change of Rate',
                'value': 'deltaRate'
              }
            ]
          },
          {
            'id': 'form',
            'label': 'Report Form',
            'type': 'select',
            'data': [
              {
                'text': 'Graphical',
                'value': 'graph'
              },
              {
                'text': 'Tabular',
                'value': 'table'
              }
            ]
          },
          {
            'id': 'type',
            'label': 'Graph Type',
            'type': 'select',
            'data': [
              {
                'text': 'Lines',
                'value': 'line'
              },
              {
                'text': 'Areas',
                'value': 'area'
              },
              {
                'text': 'Bars',
                'value': 'column'
              }
            ]
          },
          {
            'id': 'stacked',
            'label': 'Stacked Graph',
            'type': 'switch'
          },
          {
            'id': 'numeric',
            'label': 'Report On',
            'type': 'checkboxgroup',
            'data': [
              {
                'text': 'No. of Transactions',
                'value': 'txnUnits'
              }
            ]
          },
          {
            'id': 'enum1',
            'label': '$labelEnum1',
            'type': 'propertysheet-radio',
            'data': [
              {
                'id': 'teamMembers',
                'readonly': '$enum1TeamMembersReadOnly',
                'label': 'Team Members',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.teamMembers',
                    'label': 'Team Members',
                    'type': 'checkboxgroup',
                    'data': []
                  }
                ]
              },
              {
                'id': 'conversationStatus',
                'readonly': false,
                'label': 'Conversation Status',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.conversationStatus',
                    'label': 'Conversation Status',
                    'type': 'checkboxgroup',
                    'data': [
                      {
                        'text': 'New',
                        'value': 'new'
                      },
                      {
                        'text': 'Confirmed',
                        'value': 'confirmed'
                      },
                      {
                        'text': 'Resolved',
                        'value': 'resolved'
                      },
                      {
                        'text': 'Denied',
                        'value': 'denied'
                      },
                      {
                        'text': 'Closed',
                        'value': 'closed'
                      }
                    ]
                  }
                ]
              }
            ],
            'readonly': false
          },
          {
            'id': 'enum2',
            'label': '$labelEnum2',
            'type': 'select',
            'data': [
              {
                'text': 'Team Members',
                'value': 'teamMembers'
              },
              {
                'text': 'Conversation Status',
                'value': 'conversationStatus'
              }
            ]
          },
          {
            'id': 'enum2Selected',
            'type': 'hidden'
          },
          {
            'id': 'range',
            'type': 'hidden'
          }
        ],
        'invoices': [
          {
            'id': 'y',
            'label': 'Report Type',
            'type': 'select',
            'data': [
              {
                'text': 'Cumulative',
                'value': 'cumulative'
              },
              {
                'text': 'Rate',
                'value': 'rate'
              },
              {
                'text': 'Change of Rate',
                'value': 'deltaRate'
              }
            ]
          },
          {
            'id': 'form',
            'label': 'Report Form',
            'type': 'select',
            'data': [
              {
                'text': 'Graphical',
                'value': 'graph'
              },
              {
                'text': 'Tabular',
                'value': 'table'
              }
            ]
          },
          {
            'id': 'type',
            'label': 'Graph Type',
            'type': 'select',
            'data': [
              {
                'text': 'Lines',
                'value': 'line'
              },
              {
                'text': 'Areas',
                'value': 'area'
              },
              {
                'text': 'Bars',
                'value': 'column'
              }
            ]
          },
          {
            'id': 'stacked',
            'label': 'Stacked Graph',
            'type': 'switch'
          },
          {
            'id': 'numeric',
            'type': 'hidden',
            'data': [
              {
                'text': 'Invoiced Amount',
                'value': 'invoicedAmount'
              }
            ]
          },
          {
            'id': 'enum1',
            'type': 'hidden',
            'data': []
          },
          {
            'id': 'enum2',
            'type': 'hidden',
            'data': []
          },
          {
            'id': 'enum2Selected',
            'type': 'hidden'
          },
          {
            'id': 'range',
            'type': 'hidden'
          }
        ],
        'salesdr': [
          {
            'id': 'y',
            'label': 'Report Type',
            'type': 'select',
            'data': [
              {
                'text': 'Cumulative',
                'value': 'cumulative'
              },
              {
                'text': 'Rate',
                'value': 'rate'
              },
              {
                'text': 'Change of Rate',
                'value': 'deltaRate'
              }
            ]
          },
          {
            'id': 'form',
            'label': 'Report Form',
            'type': 'select',
            'data': [
              {
                'text': 'Graphical',
                'value': 'graph'
              },
              {
                'text': 'Tabular',
                'value': 'table'
              }
            ]
          },
          {
            'id': 'type',
            'label': 'Graph Type',
            'type': 'select',
            'data': [
              {
                'text': 'Lines',
                'value': 'line'
              },
              {
                'text': 'Areas',
                'value': 'area'
              },
              {
                'text': 'Bars',
                'value': 'column'
              }
            ]
          },
          {
            'id': 'stacked',
            'label': 'Stacked Graph',
            'type': 'switch'
          },
          {
            'id': 'numeric',
            'label': 'Report On',
            'type': 'checkboxgroup',
            'data': [
              {
                'text': 'No. of Transactions',
                'value': 'txnUnits'
              }
            ]
          },
          {
            'id': 'enum1',
            'label': '$labelEnum1',
            'type': 'propertysheet-radio',
            'data': [
              {
                'id': 'teamMembers',
                'readonly': '$enum1TeamMembersReadOnly',
                'label': 'Team Members',
                'type': 'propertysheet',
                'data': [
                  {
                    'id': 'items',
                    'path': 'enum1.teamMembers',
                    'label': 'Team Members',
                    'type': 'checkboxgroup',
                    'data': []
                  }
                ]
              }
            ],
            'readonly': false
          },
          {
            'id': 'enum2',
            'label': '$labelEnum2',
            'type': 'select',
            'data': [
              {
                'text': 'Team Members',
                'value': 'teamMembers'
              }
            ]
          },
          {
            'id': 'enum2Selected',
            'type': 'hidden'
          },
          {
            'id': 'range',
            'type': 'hidden'
          }
        ]
      }
    },
    {
      '$or': [
        {
          '$and': [
            {
              'numericAltered': '$numericAltered'
            },
            {
              'userSelectedTxnUnits': '$userSelectedTxnUnits'
            },
            {
              '$call': [
                'reports-config.onlyTxnUnits',
                [
                  '$numNumerics'
                ]
              ]
            },
            {
              '$bind': [
                '$enum1TeamMembersReadOnly',
                false
              ]
            }
          ]
        },
        {
          '$and': [
            {
              'numericAltered': '$numericAltered'
            },
            {
              '$call': [
                'reports-config.notTxnUnits',
                [
                  '$numNumerics'
                ]
              ]
            },
            {
              '$bind': [
                '$enum1TeamMembersReadOnly',
                true
              ]
            }
          ]
        },
        {
          '$and': [
            {
              'values': {
                'numeric': '$numeric'
              }
            },
            {
              '$call': [
                'reports-config.numTrue',
                '$numeric',
                [
                  '$numNumerics'
                ]
              ]
            }
          ]
        }
      ]
    },
    {
      '$or': [
        {
          '$and': [
            {
              '$call': [
                'reports-config.gt',
                '$numNumerics',
                1,
                [
                  '$multipleNumerics'
                ]
              ]
            },
            {
              '$bind': [
                [
                  '$labelEnum1',
                  '$labelEnum2'
                ],
                [
                  'Filter by',
                  'Analyze by'
                ]
              ]
            }
          ]
        },
        {
          '$and': [
            {
              '$bind': [
                [
                  '$labelEnum1',
                  '$labelEnum2'
                ],
                [
                  'Analyze by',
                  'Further Analyze by'
                ]
              ]
            }
          ]
        }
      ]
    }
  ],
  [
    {
      'numericAltered': '$numericAltered'
    },
    {
      'diff': '$diff'
    },
    {
      '$call': [
        'reports-config.checkPatternInKeys',
        '$diff',
        'result.numeric',
        [
          '$numericAltered'
        ]
      ]
    }
  ],
  [
    {
      'userSelectedTxnUnits': '$userSelectedTxnUnits'
    },
    {
      '$or': [
        {
          'diff': {
            'result.numeric.txnUnits': {
              'newValue': true
            }
          }
        },
        {
          'diff': {
            'result.numeric.txnUnits': {
              'newValue': 'true'
            }
          }
        }
      ]
    }
  ]
]

//console.log(JSON.stringify(validator.validateJsl(input), null, 2));
module.exports = validator.validateJsl(input);
