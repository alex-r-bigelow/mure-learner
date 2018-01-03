/* globals d3, MureModel, JsDiff */

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
  let testMureModel = new MureModel(test);
  testMureModel.getEnterFunction().apply(svg.node());

  let learnedMureModel = new MureModel();
  learnedMureModel.inferStructure(svg.selectAll('svg > ' + test.tag).nodes());

  let testStructure = testMureModel.getReadableStructureString();
  let learnedStructure = learnedMureModel.getReadableStructureString();

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
