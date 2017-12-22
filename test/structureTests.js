/* globals d3, Model, JsDiff, phantom */

let tests = [
  {
    'tag': 'g',
    'children': [
      {
        'tag': 'rect'
      }, {
        'tag': 'text',
        'children': [
          {
            'tag': 'tspan'
          }
        ]
      }
    ]
  },
  {
    'tag': 'g',
    'children': [
      {
        'tag': 'rect'
      }, {
        'tag': 'text',
        'children': [
          {
            'tag': 'tspan'
          }
        ]
      },
      {
        'tag': 'rect'
      }
    ]
  },
  {
    'tag': 'g',
    'children': [
      {
        'tag': 'g',
        'children': [
          {
            'tag': 'g',
            'children': [
              {
                'tag': 'g',
                'children': [
                  {
                    'tag': 'g',
                    'children': [
                      {
                        'tag': 'g',
                        'children': [
                          {
                            'tag': 'rect'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
tests.forEach(test => {
  let svg = d3.select('body').append('svg');
  let testModel = new Model(test);
  testModel.getEnterFunction().apply(svg.node());

  let learnedModel = new Model();
  learnedModel.inferStructure(svg.selectAll('svg > ' + test.tag).nodes());

  let testStructure = testModel.getReadableStructureString();
  let learnedStructure = learnedModel.getReadableStructureString();

  if (testStructure === learnedStructure) {
    console.log('Passed structure test:');
    console.log(testStructure);
  } else {
    console.warn('Failed structure test:');
    let diff = JsDiff.diffChars(testStructure, learnedStructure);
    let partStyles = [];
    console.log(diff.map(part => {
      if (part.added) {
        partStyles.push('color:green');
      } else if (part.removed) {
        partStyles.push('color:red');
      } else {
        partStyles.push('color:grey');
      }
      return '%c' + part.value;
    }).join(''), ...partStyles);
  }

  svg.remove();
});
