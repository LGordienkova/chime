import React, { createContext, useContext, useState } from 'react';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';

import { useAppContext } from './AppProvider';

const MeetingContext = createContext({});

export const useMeetingContext = () => useContext(MeetingContext);

const MeetingProvider = ({ children }) => {
  const meetingManager = useMeetingManager();
  const [meetingSession, setMeetingSession] = useState({});
  const { meetingInfo, closeConnection, deleteMeeting } = useAppContext();

  const joinOutgoingCallerToMeeting = async meetingData => {
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meetingData.Meeting,
      meetingData.Attendees[1]
    );

    await meetingManager.join(meetingSessionConfiguration);
    await meetingManager.start();
  };

  const configureMeetingSession = async () => {
    try {
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meetingInfo.Meeting,
        meetingInfo.Attendees[0]
      );

      await meetingManager.join(meetingSessionConfiguration);
      const logger = new ConsoleLogger('SDK', LogLevel.DEBUG);
      const deviceController = new DefaultDeviceController(logger);
      const meetingSession = new DefaultMeetingSession(
        meetingSessionConfiguration,
        logger,
        deviceController
      );

      setMeetingSession(meetingSession);

      await meetingManager.start();

      return { meetingSessionConfiguration };
    } catch (e) {
      console.log('error', e);
    }
  };

  const endMeeting = async () => {
    try {
      await meetingManager.leave();
      deleteMeeting();
      closeConnection();
    } catch (e) {
      console.error(e);
    }
  };

  const providerValue = {
    joinOutgoingCallerToMeeting,
    configureMeetingSession,
    meetingSession,
    endMeeting,
    meetingManager,
  };

  return <MeetingContext.Provider value={providerValue}>{children}</MeetingContext.Provider>;
};

export default MeetingProvider;
