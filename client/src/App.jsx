import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import {
  MeetingProvider as ChimeMeetingProvider,
  lightTheme,
} from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';

import Home from './pages/Home';
import Meeting from './pages/meeting/Meeting';
import AppProvider from './providers/AppProvider';
import MeetingProvider from './providers/MeetingProvider';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <ChimeMeetingProvider>
        <AppProvider>
          <MeetingProvider>
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/meeting/:meetingId" element={<Meeting />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </MeetingProvider>
        </AppProvider>
      </ChimeMeetingProvider>
    </ThemeProvider>
  );
}

export default App;
