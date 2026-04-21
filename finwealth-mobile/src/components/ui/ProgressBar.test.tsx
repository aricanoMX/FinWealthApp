import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders correctly with 50% progress', () => {
    const { getByText } = render(
      <ProgressBar
        label="Comida"
        progress={50}
        spent={500}
        limit={1000}
        currency="USD"
      />
    );

    expect(getByText('Comida')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText(' / $1,000.00')).toBeTruthy();
  });

  it('renders correctly with 110% progress', () => {
    const { getByText } = render(
      <ProgressBar
        label="Ocio"
        progress={110}
        spent={1100}
        limit={1000}
        currency="USD"
      />
    );

    expect(getByText('110%')).toBeTruthy();
    expect(getByText('$1,100.00')).toBeTruthy();
  });
});
