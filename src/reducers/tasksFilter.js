const initialState = 'Все';

export default function tasksFilter(state = initialState, action) {
	if (action.type === 'CHANGE_FILTER') {
		const newState = action.newFilter;
		return newState;
	}
	return state;
}