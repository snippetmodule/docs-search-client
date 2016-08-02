import * as React from 'react';
import { increment, decrement } from '../../redux/modules/counter/counter';
import {IReduxState, IReduxAction } from '../../redux/model';
const { connect } = require('react-redux');
const s = require('./style.css');

interface IProps {
  counter: IReduxState;
  increment: Redux.ActionCreator<IReduxAction>;
  decrement: Redux.ActionCreator<IReduxAction>;
}

@connect(
  state => ({ counter: state.counter }),
  dispatch => ({
    decrement: () => dispatch(decrement()),
    increment: () => dispatch(increment()),
  })
)
class Counter extends React.Component<IProps, void> {

  public render() {
    const { increment, decrement, counter } = this.props;

    return (
      <div className={s.counter}>
        <h4>Counter Example</h4>
        <button
          name="incBtn"
          onClick={increment}>
            INCREMENT
        </button>
        <button
          name="decBtn"
          onClick={decrement}
          disabled={counter.count <= 0}>
            DECREMENT
        </button>
        <p>{counter.count}</p>
      </div>
    );
  }
}

export { Counter }
