import { combineReducers } from 'redux'
import user from './user';
import consumerVerification from './consumerVerification';

const reducer = combineReducers({
    user,
    consumerVerification,
})

export default reducer