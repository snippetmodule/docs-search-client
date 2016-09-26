import * as React from 'react';
import { getStars } from '../../redux/reducers/stars';
import { IStars } from '../../redux/reducers/stars.model';
import { IReduxAction } from '../../redux/reducers/model';
const { connect } = require('react-redux');
const { asyncConnect } = require('redux-connect');

interface IProps {
  stars: IStars;
  getStars: Redux.ActionCreator<IReduxAction>;
}

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    return dispatch(getStars());
  },
}])
@connect(
  state => ({ stars: state.stars })
)
class Stars extends React.Component<IProps, {}> {

  public render() {
    const { stars } = this.props;

    return (
      <div className="_container" role="document">
        <div className="_content">
          <div>
            {stars.isFetching ? 'Fetching Stars' : stars.count}
          </div>
        </div>
      </div>
    );
  }
}

export { Stars }
