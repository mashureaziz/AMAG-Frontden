/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SiteAudit from './SiteAudit';

// Test all form components properly render
describe('Test Audit Form Components', () => {
  render(<SiteAudit
    siteNo={30}
  />);
  test('Name input present', () => {
    const inputEl = screen.getByText('Name');
    expect(inputEl).toBeInTheDocument();
  });

  test('Region input present', () => {
    render(<SiteAudit
      siteNo={30}
    />);
    const inputEl = screen.getByText('Jurisdiction/City/Region');
    expect(inputEl).toBeInTheDocument();
  });

  test('Latitude input present', () => {
    render(<SiteAudit
      siteNo={30}
    />);
    const inputEl = screen.getByText('Latitude');
    expect(inputEl).toBeInTheDocument();
  });

  test('Longitude input present', () => {
    render(<SiteAudit
      siteNo={30}
    />);
    const inputEl = screen.getByText('Longitude');
    expect(inputEl).toBeInTheDocument();
  });

  test('Description input present', () => {
    render(<SiteAudit
      siteNo={30}
    />);
    const inputEl = screen.getByText('Site Description');
    expect(inputEl).toBeInTheDocument();
  });

  test('Save Button Renders', () => {
    const result = render(<SiteAudit
      siteNo={30}
    />);
    const saveButton = result.container.querySelector('#save');
    expect(saveButton).toBeInTheDocument();
  });

  test('Cacnel Button Renders', () => {
    render(<SiteAudit
      siteNo={30}
    />);
    const inputEl = screen.getByText('Cancel');
    expect(inputEl).toBeInTheDocument();
  });
});

// Test input validations are performed properly
describe('Test input validation', () => {
  test('Name cannot be empty', () => {
    const result = render(<SiteAudit
      siteNo={30}
    />);
    const saveButton = result.container.querySelector('#save');
    userEvent.click(saveButton);
    const nameError = screen.getByText('Name is required');
    expect(nameError).toBeInTheDocument();
  });

  test('Latitude value must be between -90 and +90', () => {
    const result = render(<SiteAudit
      siteNo={30}
    />);
    const Latitude = result.container.querySelector('#siteLatitude');
    const saveButton = result.container.querySelector('#save');
    userEvent.type(Latitude, '-120');
    userEvent.click(saveButton);
    const error = screen.getByText('Latitude value must be between -90 and +90');
    expect(error).toBeInTheDocument();
  });

  test('Longitude value must be between -180 and +180', () => {
    const result = render(<SiteAudit
      siteNo={30}
    />);
    const Longitude = result.container.querySelector('#siteLongitude');
    const saveButton = result.container.querySelector('#save');
    userEvent.type(Longitude, '230');
    userEvent.click(saveButton);
    const error = screen.getByText('Longitude value must be between -180 and +180');
    expect(error).toBeInTheDocument();
  });
});
