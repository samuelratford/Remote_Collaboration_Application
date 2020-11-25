// This code is written by Samuel Ratford
// Some parts of the code are adapted from an exmapl egiven by Desmos Graphing, this part is indicated.

import { React, socketSendState, socketGetState } from "./ExtensionLibrary";

export default class GraphDesmos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // The following code is adapted from https://www.desmos.com/api/v1.5/docs/index.html in the section called Quick Start. 
    var elt = document.getElementById('calculator' + this.props.parent);
    var calculator = window.Desmos.GraphingCalculator(elt);
    calculator.setExpression({
      id: 'graph1',
      latex: 'y=x^2'
    });
    // End of adapted code from https://www.desmos.com/api/v1.5/docs/index.html
    calculator.observeEvent('change', () => {
      if (this.props.creator) {
        socketSendState(this.props, {
          roomID: this.props.roomID,
          expressions: calculator.getExpressions()
        });
      }
    });

    socketGetState(this.props, (res) => {
      if (calculator.getExpressions() !== res.expressions) {
        calculator.setExpressions(res.expressions);
      }
    });


  }

  render() {
    const divStyle = {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    };

    return React.createElement('div', {
      key: 'graph' + this.props.parent,
      style: divStyle,
      id: 'calculator' + this.props.parent
    });
  }

}
