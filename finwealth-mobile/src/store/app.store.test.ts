import { useAppStore } from './app.store';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const initialState = useAppStore.getState();
    useAppStore.setState(initialState, true);
  });

  it('should initialize with isInitialized as false', () => {
    const { isInitialized } = useAppStore.getState();
    expect(isInitialized).toBe(false);
  });

  it('should update isInitialized when setInitialized is called', () => {
    const { setInitialized } = useAppStore.getState();

    // Call the action
    setInitialized(true);

    // Check the new state
    expect(useAppStore.getState().isInitialized).toBe(true);
  });
});
